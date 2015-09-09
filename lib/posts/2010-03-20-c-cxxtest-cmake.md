---
layout: post.jade
title: c++, cxxtest, cmake
author: Adam Stokes
date: 2010-03-20T00:59Z
tags: [c++]
---
Been messing around lately with CMake and how to intregrate additional testing
frameworks such as CxxTest. So far everything has been very simple to configure
and get setup so I thought Id post my findings here.

* Fedora provides both cmake and cxxtest so install these first.
* CMake provides a convenience macro called FindCxxTest.cmake
* In your CMakeLists.txt append the following:

```cmake
find_package(CxxTest)
if(CXXTEST_FOUND)
set(CXXTEST_USE_PYTHON TRUE)
include_directories(${CXXTEST_INCLUDE_DIR})
enable_testing()
CXXTEST_ADD_TEST(unittest_sos check_sos.cpp ${SOS_TEST_PATH}/check_sos.h)
target_link_libraries(unittest_sos sos)
endif()
```

The only custom variable here is **SOS_TEST_PATH** which basically points to
`$HOME/sos/tests/check_sos.h`. See the **set** function in the cmake
documentation.

If anyone has any good information on using cmake with python build scripts Id
love to see those. For RPM Builders the spec file was very simple. I used the
syntax within the kde builds:

```rpm
%build
mkdir -p %{_target_platform}
pushd %{_target_platform}
cmake ..
popd
make %{?_smp_mflags} -C %{_target_platform}
%install
rm -rf $RPM_BUILD_ROOT
make -C %{_target_platform} install DESTDIR=$RPM_BUILD_ROOT
%clean
rm -rf $RPM_BUILD_ROOT
%post -p /sbin/ldconfig
%postun -p /sbin/ldconfig
%files
%defattr(-,root,root,-)
%doc
%{_libdir}/%{name}.so.*
%files devel
%defattr(-,root,root,-)
%doc
%{_includedir}/%{name}
%{_libdir}/%{name}.so*
%{_libdir}/pkgconfig/%{name}.pc
```

Hope this little bit will help others who are interested in cmake.
