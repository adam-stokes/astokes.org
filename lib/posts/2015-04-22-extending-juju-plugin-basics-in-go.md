---
title: Extending Juju, Plugin basics in Go
date: 2015-04-22T02:52Z
featured: juju.png
tags: [ubuntu, juju]
---

This is a quick introduction on extending Juju with plugins written in Go. What we'll cover:

* Setting up your Go environment
* Getting the Juju source code
* Writing a basic plugin named **juju-lyaplugin** short for (juju-learnyouaplugin)
* End result will be a plugin that closely resembles what **juju run** would do.

# Prerequisites

* Running on Ubuntu 14.04 or above
* Go 1.2.1 or above (Article written using Go 1.2.1)
* A basic understanding of the Go language, package imports, etc.

# Setting up your Go environment

This is all a matter of preference but for the sake of this article we'll do it
my way :)

## Install Go

On Trusty and above:

```
sudo apt-get install golang
```

## Go dependency management

2 projects I use are:

* https://github.com/pote/gpm - Barebones dependency manager for Go
* https://github.com/pote/gvp - Go Versioning Packager

### Install

```
$ cd /tmp && git clone https://github.com/pote/gvp.git && cd gvp && sudo ./configure && sudo make install
$ cd /tmp && git clone https://github.com/pote/gpm.git && cd gpm && sudo ./configure && sudo make install
```

Feel free to check out their project pages for additional uses.

## Create your project directory

```
$ mkdir ~/Projects/juju-learnyouaplugin
$ cd ~/Projects/juju-learnyouaplugin
```

## Setup the project specific Go paths

```
$ source gvp in
```

This will setup your **$GOPATH** and **$GOBIN** variables for use when resolving imports, compiling, etc.

```
$ echo $GOPATH
/home/adam/Projects/juju-learnyouaplugin/.godeps
$ echo $GOBIN
/home/adam/Projects/juju-learnyouaplugin/.godeps/bin
```

From this point on all package dependencies will be stored in the project's **.godeps** directory.

# Get the Juju code

From your project's directory run:

```
$ go get -d -v github.com/juju/juju/...
```

# Writing the plugin

Now that all the preparatory tasks are complete we can begin the fun
stuff. Using your favorite editor open up a new file **main.go**. Within this file we need to define a few
package imports that are necessary for the plugin.

```go
import (
	"fmt"
	"github.com/juju/cmd"
	"github.com/juju/juju/apiserver/params"
	"github.com/juju/juju/cmd/envcmd"
	"github.com/juju/juju/juju"
	"github.com/juju/loggo"
	"github.com/juju/names"
	"launchpad.net/gnuflag"
	"os"
	"time"

	_ "github.com/juju/juju/provider/all"
)
```

Let's go through the imports and list why they are required.

 * **github.com/juju/cmd** - This import gives us access to the run context of a command ***[DefaultContext](https://godoc.org/github.com/juju/cmd#Context)***
 * **github.com/juju/juju/cmd/envcmd** - Provides ***[EnvCommandBase](https://godoc.org/github.com/juju/juju/cmd/envcmd#EnvCommandBase)*** for creating new commands and giving us access to the
   [API Client](https://godoc.org/github.com/juju/juju/cmd/envcmd#EnvCommandBase.NewAPIClient) for making queries against the Juju state server.
 * **github.com/juju/juju/apiserver/params** - Provides access to 2 types [RunParams](https://godoc.org/github.com/juju/juju/apiserver/params#RunParams) and [RunResults](https://godoc.org/github.com/juju/juju/apiserver/params#RunResult) for executing the api call to [Run](https://godoc.org/github.com/juju/juju/api#Client.Run) and return the executed results.
 * **github.com/juju/juju/juju** - Provides access to ***[InitJujuHome](https://godoc.org/github.com/juju/juju/juju#InitJujuHome)*** for initializing the necessary bits like charm cache and environment. Required before running any juju cli command.
 * **github.com/juju/loggo** - Provides access to juju's logging api
 * **github.com/juju/names** - This package provides some convenience functions in particular we'll use ***[IsValidMachine](https://godoc.org/github.com/juju/names#IsValidMachine)***
 * **launchpad.net/gnuflag** - Provides the interface for our command definition like setting arguments, usage information, and execution.
 * **github.com/juju/juju/provider/all** - Registers all known providers (amazon, maas, local, etc)

With that said let's spec out the plugin type. This will hold our embedded command base and cli arguments.

```go
type LYAPluginCommand struct {
	envcmd.EnvCommandBase
	out      cmd.Output
	timeout  time.Duration
	machines []string
	services []string
	units    []string
	commands string
	envName string
	description bool
}
```

Once defined we can spec out our cli command and its functions.

### The info function

First part of the command is the ***[Info()](https://godoc.org/github.com/juju/cmd#SuperCommand.Info)*** function which returns
information about the particular subcommand, in our case that is **lyaplugin**

```go
var doc = `Run a command on target machine(s)

This example plugin mimics what "juju run" does.

eg.

juju lyaplugin -m 1 -e local "touch /tmp/testfile"
`

func (c *LYAPluginCommand) Info() *cmd.Info {
	return &cmd.Info{
		Name:    "lyaplugin",
		Args:    "<commands>",
		Purpose: "Run a command on remote target",
		Doc:     doc,
	}
}
```

### SetFlags function

Next we'll define what arguments are available to this new subcommand (**lyaplugin**).

```go
func (c *LYAPluginCommand) SetFlags(f *gnuflag.FlagSet) {
	f.BoolVar(&c.description, "description", false, "Plugin Description")
	f.Var(cmd.NewStringsValue(nil, &c.machines), "machine", "one or more machine ids")
	f.Var(cmd.NewStringsValue(nil, &c.machines), "m", "")
	f.StringVar(&c.envName, "e", "local", "Juju environment")
	f.StringVar(&c.envName, "environment", "local", "")
}
```

Here we are providing a ***--description*** argument to satisfy a [Juju plugin requirement](https://github.com/juju/plugins#plugin-requirements). In addition a target argument **-m/--machine MACHINEID** and the ability to define which juju environment to execute this in **-e/--environment** defaults to **local** environment.

### Init function

Here we'll parse the cli arguments, do some basic sanity checking to make sure the passed arguments validate to our liking.

```go
func (c *LYAPluginCommand) Init(args []string) error {
	if c.description {
		fmt.Println(doc)
		os.Exit(0)
	}
	if len(args) == 0 {
		return fmt.Errorf("no commands specified")
	}
	if c.envName == "" {
		return fmt.Errorf("Juju environment must be specified.")
	}
	c.commands, args = args[0], args[1:]
	if len(c.machines) == 0 {
		return fmt.Errorf("You must specify a target with --machine, -m")
	}

	for _, machineId := range c.machines {
		if !names.IsValidMachine(machineId) {
			return fmt.Errorf("(%s) not a valid machine id.", machineId)
		}
	}
	return cmd.CheckEmpty(args)
}
```

Notice the **names.IsValidMachine(machineId)** which was imported above as this is the only place where we make use of that
particular package.

### Run function

To the heart of the command where the execution based on the cli arguments take place. I'll describe inline what is happening:

```go
func (c *LYAPluginCommand) Run(ctx *cmd.Context) error {
	c.SetEnvName(c.envName)
```
Set the environment name pulled from our arguments list so we known which environment to run our command against.

```go
	client, err := c.NewAPIClient()
	if err != nil {
		return fmt.Errorf("Failed to load api client: %s", err)
	}
	defer client.Close()
```

Grab the api client for the current environment.

```go
	var runResults []params.RunResult

	logger.Infof("Running cmd: %s on machine: %s", c.commands, c.machines[0])
	params := params.RunParams{
		Commands: c.commands,
		Timeout:  c.timeout,
		Machines: c.machines,
		Services: c.services,
		Units:    c.units,
	}
```

Prepare the **RunParams** for passing to the api's **Run** function.

```go
	runResults, err = client.Run(params)
	if err != nil {
		fmt.Errorf("An error occurred: %s", err)
	}
	if len(runResults) == 1 {
		result := runResults[0]
		logger.Infof("Result: out(%s), err(%s), code(%d)", result.Stdout, result.Stderr, result.Code)
	}
	return nil
}
```

Execute the api **Run** function and return the results from the executed command on the machine.

### Entrypoint

The last bit of code is our **main** function which ties everything together.

```go
func main() {
	loggo.ConfigureLoggers("<root>=INFO")
	err := juju.InitJujuHome()
```

Initialize the Juju environment based on the default paths or if **$JUJU_HOME** is defined.

```go
	if err != nil {
		panic(err)
	}

	ctx, err := cmd.DefaultContext()
	if err != nil {
		panic(err)
	}
```

Set the proper command context

```
	c := &LYAPluginCommand{}
	cmd.Main(c, ctx, os.Args[1:])
}
```
Pass our plugin type/command into the supplied command Context and off you go.

# Finish

With the code written, build and run the command.

```
$ go build -o juju-lyaplugin -v main.go
```

Place the executable somewhere in your **$PATH**
```
$ mv juju-lyaplugin ~/bin
```

See if Juju picks it up

```
$ juju help lyaplugin
usage: lyaplugin [options] <commands>
purpose: Run a command on remote target

options:
--description  (= false)
    Plugin Description
-e, --environment (= "local")
    Juju environment
-m, --machine  (= )


Run a command on target machine(s)

This example plugin mimics what "juju run" does.

eg.

juju lyaplugin -m 1 -e local "touch /tmp/testfile"
```

See it in your list of plugins, requires [juju-plugins](https://github.com/juju/plugins) to be installed:

```
$ juju help plugins
Juju Plugins

Plugins are implemented as stand-alone executable files somewhere in the user's PATH.
The executable command must be of the format juju-<plugin name>.

...
git-charm        Clone and keep up-to-date a git repository containing a Juju charm for easy source managing.
kill             Destroy a juju object and reap the environment.
lyaplugin        Run a command on target machine(s)
...
```

This should hopefully give you a better idea where to start when you decide to dive into writing a juju plugin :)

[Full source code for juju-learnyouaplugin](https://github.com/battlemidget/juju-learnyouaplugin)
