/* Global Header Redesign - 09/2018 */

document.addEventListener("DOMContentLoaded", () => {
  /* Document Load Functions Here */
  const $wheather = document.querySelector(".weather"),
    $activeButton = document.querySelector(".main-menu__nav-item.active");

  if ($activeButton) {
    $activeButton.parentElement.parentElement.scrollLeft =
      $activeButton.getBoundingClientRect().left;
  }

  var submenuSelector = document.querySelector(
      ".header__bottom-menu__container"
    ),
    submenuItems =
      submenuSelector && submenuSelector.querySelectorAll(".swiper-slide a");
  if (submenuItems) {
    for (let i = 0, length = submenuItems.length; i < length; i++) {
      const item = submenuItems[i];
      if (window.location.pathname == item.getAttribute("href")) {
        item.classList.add("active-menu");
      }
    }
  }

  if ($wheather) {
    const istanbulId = "11508",
      citiesInput = $wheather.querySelector(".cities-popup__input"),
      $wheatherSelector = document.querySelector(".weather__selector"),
      $wheatherArrow = $wheatherSelector.querySelector(".weather__arrow"),
      localCityId = localStorage.getItem("cityId");

    if (!localCityId) {
      localStorage.setItem("cityId", istanbulId);
      gh.getWeatherData(istanbulId);
    } else {
      gh.getWeatherData(localCityId);
    }

    $wheatherSelector.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      gh.getCities();
      gh.headerSearchBar.close();
      $wheatherArrow.getAttribute("data-arrow-direction") === "down"
        ? $wheatherArrow.setAttribute("data-arrow-direction", "up")
        : $wheatherArrow.setAttribute("data-arrow-direction", "down");
    });

    document
      .querySelector(".cities-popup")
      .addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
      });

    citiesInput.addEventListener("keyup", (event) => {
      gh.initWeatherSearch(event.target.value);
    });

    citiesInput.addEventListener("blur", () => {
      // Blur kısmında fonksiyon istenirse buraya eklenecek
      citiesInput.value = "";
    });

    document.addEventListener("click", () => {
      const $citiesPopup = document.querySelector(
        "[data-toggle-src='cities-popup']"
      );

      if ($citiesPopup) {
        $citiesPopup.setAttribute("data-visible", "false");
      }

      $wheatherArrow.setAttribute("data-arrow-direction", "down");
    });
  }

  document.querySelector("header.header") && gh.initToggle();

  // Dropdown fonksiyonu calistiriliyor.
  //  gh.globalDropDown.init();

  // Searchbar fonksiyonu calistiriliyor.
  // gh.headerSearchBar.init();

  const button = document.querySelector(".social-media-button");
  const popover = document.querySelector(".social-media-popover");

  button.addEventListener("mouseenter", () => {
    popover.style.display = "block";
  });

  button.addEventListener("mouseleave", () => {
    setTimeout(() => {
      if (!popover.matches(":hover") && !button.matches(":hover")) {
        popover.style.display = "none";
      }
    }, 500); // Küçük bir gecikme ile popover'ın kapanmasını sağlamak
  });

  popover.addEventListener("mouseenter", () => {
    popover.style.display = "block";
  });

  popover.addEventListener("mouseleave", () => {
    popover.style.display = "none";
  });
});

window.addEventListener("load", () => {
  /* Load Functions Here */
  gh.pageSkinScrollTarget();
});

const gh = {
  /* Whole Global Header specific functions'll be written in here */
  headerSearchBar: {
    search: (value) => {
      if (!value) return false;

      if (value.length < 3) {
        return false;
      }

      value = value.turkishToLower().replace(/ /g, "-");
      var platform = document
        .querySelector("[js-role='searchBarInput']")
        .getAttribute("data-cat");
      if (platform != undefined && platform != "fanatik") {
        var sName = platform;
        if (sName == "cadde") {
          sName = "magazin";
        }
        window.setTimeout(() => {
          window.location.href = `${
            window.location.origin
          }/arama/${value.turkishToLower()}?s=${sName}&platform=${platform}`;
        }, 2000);
      } else {
        window.setTimeout(() => {
          window.location.href = `${
            window.location.origin
          }/haberleri/${value.turkishToLower()}`;
        }, 2000);
      }
    },
    keyup: (event) => {
      const $searchbarInput = document.querySelector(
        "[js-role='searchBarInput']"
      );
      if (event.key === "Enter") {
        const { value } = event.target;
        $searchbarInput.value = "";
        gh.headerSearchBar.search(value);
      }
    },
    submit: () => {
      const $searchbarInput = document.querySelector(
          "[js-role='searchBarInput']"
        ),
        { value } = $searchbarInput;
      $searchbarInput.value = "";
      gh.headerSearchBar.search(value);
    },
    open: () => {
      const $searchBar = document.querySelector(".searchbar"),
        $searchBarInput = $searchBar.querySelector(".searchbar__input"),
        $btnToggle = document.querySelector("[js-role='searchOpenClose']"),
        $btnClose = document.querySelector("[js-role='searchClose']"),
        $body = document.body;

      $searchBar.setAttribute("data-status", "visible");
      $btnToggle.setAttribute("data-status", "active");
      $btnClose.setAttribute("data-status", "active");
      $body.setAttribute("data-search-bar", "active");

      // searchbar acildiginda hamburger menu kapatiliyor
      gh.hamburgerMenu.close();

      // searchbar açıldığında inputa focus oluyor
      setTimeout(() => {
        $searchBarInput.focus();
      }, 100);
    },
    close: () => {
      const $searchBar = document.querySelector(".searchbar"),
        $btnToggle = document.querySelector("[js-role='searchOpenClose']"),
        $btnClose = document.querySelector("[js-role='searchClose']"),
        $body = document.body;

      $searchBar.setAttribute("data-status", "");
      $btnToggle.setAttribute("data-status", "");
      $btnClose.setAttribute("data-status", "");
      $body.setAttribute("data-search-bar", "");
    },
    toggle: () => {
      const $searchBar = document.querySelector(".searchbar"),
        $searchBarInput = $searchBar.querySelector(".searchbar__input"),
        $btnToggle = document.querySelector("[js-role='searchOpenClose']"),
        $btnClose = document.querySelector("[js-role='searchClose']"),
        $body = document.body;

      $searchBar.setAttribute(
        "data-status",
        $searchBar.getAttribute("data-status") === "visible" ? "" : "visible"
      );
      $btnToggle.setAttribute(
        "data-status",
        $btnToggle.getAttribute("data-status") === "active" ? "" : "active"
      );
      $btnClose.setAttribute(
        "data-status",
        $btnClose.getAttribute("data-status") === "active" ? "" : "active"
      );
      $body.setAttribute(
        "data-search-bar",
        $body.getAttribute("data-search-bar") === "active" ? "" : "active"
      );

      setTimeout(() => {
        $searchBarInput.focus();
      }, 100);

      // searchbar acildiginda hamburger menu kapatiliyor
      gh.hamburgerMenu.close();
    },
    init: () => {
      const $btnToggle = document.querySelector("[js-role='searchOpenClose']"),
        $btnClose = document.querySelector("[js-role='searchClose']"),
        $searchbarInput = document.querySelector("[js-role='searchBarInput']"),
        $searchbarSubmit = document.querySelector(
          "[js-role='searchBarSubmit']"
        );

      // Search close tiklandiginda
      if ($btnClose) {
        $btnClose.addEventListener("click", () => {
          gh.headerSearchBar.toggle();
        });
      }
      // Main menu search iconu tiklandiginda
      if ($btnToggle) {
        $btnToggle.addEventListener("click", (event) => {
          event.stopPropagation();
          gh.headerSearchBar.toggle();
        });
      }
      // Search Input a data girildiginde
      if ($searchbarInput) {
        $searchbarInput.addEventListener("keyup", (event) => {
          gh.headerSearchBar.keyup(event);
        });

        $searchbarInput.addEventListener("click", (event) => {
          event.stopPropagation();
        });
      }
      // Search Input submit edildiginde
      if ($searchbarSubmit) {
        $searchbarSubmit.addEventListener("click", (event) => {
          event.stopPropagation();
          gh.headerSearchBar.submit();
        });
      }

      document.addEventListener("click", () => {
        gh.headerSearchBar.close();
      });
    },
  },
  breakingNewsInit: ({ loop = true, interval = 4000, autoplay }) => {
    const breakingNewsNavBack = document.querySelector(
        ".breaking-news__button--prev"
      ),
      breakingNewsNavNext = document.querySelector(
        ".breaking-news__button--next"
      ),
      breakingNewsItems = document.querySelectorAll(".breaking-news__item"),
      breakingNewsItemsCount = breakingNewsItems.length,
      changeBrekingDisplayStatus = () => {
        Array.prototype.forEach.call(breakingNewsItems, (item, index) => {
          if (index === breakingNewsIndex) {
            item.classList.add("breaking-news__item--visible");
          } else {
            item.classList.remove("breaking-news__item--visible");
          }
        });
      };

    if (autoplay) {
      window.setInterval(() => {
        breakingNewsNext();
      }, interval);
    }

    let breakingNewsIndex = 0;
    changeBrekingDisplayStatus(breakingNewsIndex);

    if (breakingNewsNavNext) {
      breakingNewsNavNext.addEventListener("click", (event) => {
        gh.stopCurrentProgress(event);
        breakingNewsNext();
      });
    }

    if (breakingNewsNavBack) {
      breakingNewsNavBack.addEventListener("click", () => {
        if (breakingNewsIndex !== 0) {
          breakingNewsIndex -= 1;

          changeBrekingDisplayStatus(breakingNewsIndex);
        } else if (loop) {
          breakingNewsIndex = breakingNewsItemsCount - 1;
          changeBrekingDisplayStatus(breakingNewsIndex);
        }
      });
    }

    const breakingNewsNext = () => {
      if (breakingNewsIndex + 1 !== breakingNewsItemsCount) {
        breakingNewsIndex += 1;
        changeBrekingDisplayStatus(breakingNewsIndex);
      } else if (loop) {
        breakingNewsIndex = 0;
        changeBrekingDisplayStatus(breakingNewsIndex);
      }
    };
  },
  globalDropDown: {
    closeAll: () => {
      const $dropDownButtons = document.querySelectorAll(
        "[js-role='dropDownButton']"
      );
      Array.prototype.forEach.call($dropDownButtons, ($dropDownBtn) => {
        const $caret = $dropDownBtn.querySelector("[data-arrow-direction]"),
          $dropDownContent = $dropDownBtn.nextElementSibling;
        $caret.setAttribute("data-arrow-direction", "down");
        $dropDownContent.setAttribute("data-status", "");
        $dropDownBtn.setAttribute("data-status", "");
      });
    },
    toggle: ($el) => {
      const $caret = $el.querySelector("[data-arrow-direction]"),
        direction = $caret.getAttribute("data-arrow-direction"),
        $dropDownContent = $el.nextElementSibling;
      if (direction === "down") {
        gh.globalDropDown.closeAll();
      }
      direction === "down"
        ? $caret.setAttribute("data-arrow-direction", "up")
        : $caret.setAttribute("data-arrow-direction", "down");
      $dropDownContent.setAttribute(
        "data-status",
        $dropDownContent.getAttribute("data-status") === "drop-visible"
          ? ""
          : "drop-visible"
      );
      $el.setAttribute(
        "data-status",
        $el.getAttribute("data-status") === "active" ? "" : "active"
      );
    },
    init: () => {
      const $dropDownButtons = document.querySelectorAll(
        "[js-role='dropDownButton']"
      );
      if ($dropDownButtons) {
        // DropDown button tiklandiginda
        Array.prototype.forEach.call($dropDownButtons, ($dropDownBtn) => {
          $dropDownBtn.addEventListener("click", (e) => {
            gh.globalDropDown.toggle($dropDownBtn);
            gh.stopCurrentProgress(e);
          });
        });
        // Window da elementten disari tiklandiginda
        window.addEventListener("click", function (e) {
          if (
            e.target.getAttribute("js-role") !== "dropDownButton" &&
            commonApp.helpers.closest(
              e.target,
              "[data-status='drop-visible']"
            ) === null
          ) {
            gh.globalDropDown.closeAll();
          }
        });
      }
    },
  },
  stopCurrentProgress: (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();
    event.stopPropagation();
  },
  getEconomyData: () => {
    commonApp.getData("/api/currency/getcurrency", (data) => {
      const $currencyWrappers = document.querySelectorAll(
        "[data-component='currency']"
      );

      if ($currencyWrappers.length > 0) {
        Array.prototype.forEach.call($currencyWrappers, (wrapper) => {
          data.forEach((currency) => {
            const {
                Status,
                Close,
                Ask,
                Percent,
                Type,
                Time,
                DailyChange,
                Open,
                CloseBefore,
              } = currency,
              typeSelector = Type.toLowerCase().split(" ").join("-"),
              item = wrapper.querySelector(
                `[data-currency-type='${typeSelector}']`
              );

            if (item) {
              if (typeSelector === "imkb-100-endeksi") {
                /* bist için kapanış değeri ekleniyor */
                item.querySelector("[data-currency-name='text']").innerText =
                  Close || Ask;
              } else {
                item.querySelector("[data-currency-name='text']").innerText =
                  Ask || Close;
              }

              if (item.querySelector("[data-currency-name='diff']")) {
                item.querySelector("[data-currency-name='diff']").innerText =
                  "% " + Percent;
              }

              item
                .querySelector("[data-currency-name='value']")
                .setAttribute("data-currency-value", Status);

              if (item.querySelector("[data-currency-name='time']")) {
                item.querySelector("[data-currency-name='time']").innerText =
                  Time;
              }

              if (item.querySelector("[data-currency-name='changes']")) {
                item.querySelector(
                  "[data-currency-name='changes']"
                ).innerText = `${Percent}% ${DailyChange}`;
              }

              if (item.querySelector("[data-currency-name='open']")) {
                item.querySelector("[data-currency-name='open']").innerText =
                  Open;
              }
              if (item.querySelector("[data-currency-name='closeBefore']")) {
                item.querySelector(
                  "[data-currency-name='closeBefore']"
                ).innerText = CloseBefore;
              }
            }
          });
        });
      }
    });
  },
  getWeatherData: (cityId) => {
    let weatherApi = "/api/weather/getweather/" + cityId;

    commonApp.getData(weatherApi, (data) => {
      const $weatherValue = document.querySelector(".weather__value"),
        $weatherIcon = document.querySelector(".weather__icon"),
        $weatherCity = document.querySelector(".weather__city");

      if ($weatherValue) {
        let { CityDegree, IconCssClass, CityName } = data;
        $weatherValue.innerHTML = CityDegree;
        $weatherCity.innerHTML = CityName;

        if (IconCssClass === "") {
          IconCssClass = "deneme";
        }
        $weatherIcon.setAttribute("data-weather-status", IconCssClass);
      }
    });
  },
  getCities: () => {
    const citiesPopup = document.querySelector(".cities-popup");

    if (citiesPopup) {
      const citiesPopupList = document.querySelector(".cities-popup__list");
      let output = "",
        citiesData;

      commonApp.getData("/api/weather/getcities", (data) => {
        citiesData = data;

        citiesData.map((city) => {
          output += `<li data-city-plate="${city.CityId}" data-city-id="${city.XmlId}" data-city-name="${city.LowerCityName}" class="cities-popup__city">${city.CityName}</li>`;
        });

        citiesPopupList.innerHTML = output;

        gh.initWeatherClick();
      });
    }
  },
  hamburgerMenu: {
    toggle: () => {
      document.body.setAttribute(
        "data-hamburger-menu",
        document.body.getAttribute("data-hamburger-menu") === "active"
          ? ""
          : "active"
      );
    },
    close: () => {
      document.body.setAttribute("data-hamburger-menu", "");
    },
    init: () => {
      const $hamburgerBtn = document.querySelectorAll(
          "[js-role='hamburgerToggle']"
        ),
        $searchBar = document.querySelector(".searchbar");
      // hem hamburger butonu hem de overlay icin calisir
      if ($hamburgerBtn) {
        Array.prototype.forEach.call($hamburgerBtn, ($hmBtn) => {
          $hmBtn.addEventListener("click", function (e) {
            if (typeof Blazy !== "undefined") {
              var bLazy = new Blazy({
                selector: ".lazy",
                offset: 300,
              });
            }
            gh.hamburgerMenu.toggle();
            // menu acildiginde searchbar kapaniyor
            if ($searchBar) {
              gh.headerSearchBar.close();
            }
            // menu acildiginda header scroll aksiyon classi kaldiriliyor
            if (document.body.classList.contains("main-menu__scroll-view")) {
              document.body.classList.remove("main-menu__scroll-view");
            }
            e.preventDefault();
          });
        });
      }
    },
  },

  initToggle: () => {
    var header = document.querySelector("header.header.header-desktop"),
      nav = header.querySelector(".header-desktop .header__main-menu"),
      navMenu = nav.querySelector(".header-desktop .header__main-menu--nav"),
      menuItems = navMenu.querySelectorAll(".header-desktop .item:not(.more)"),
      subMenu = navMenu.querySelectorAll(".header-desktop .sub-menu"),
      mobileMenu = document.querySelector(".header__mobile-menu");

    subMenuSliderItem = [];

    headerSearch = document.querySelector(".header-desktop .header__search");

    bottomMenuNav = document.querySelector(".header__bottom-menu__container");

    var detectMobile = () => {
        if (window.innerWidth < 1025) {
          return true;
        } else {
          return false;
        }
      },
      subMenuSlider = (submenuContainer, i) => {
        setTimeout(() => {
          subMenuSliderItem[i] = new Swiper(submenuContainer, {
            freeMode: false,
            direction: "horizontal",
            mousewheel: true,
            slidesPerView: "auto",
            slideToClickedSlide: false,
            roundLengths: true,
            spaceBetween: 0,
            navigation: {
              nextEl:
                submenuContainer.parentElement.querySelector(".menu-nav-next"),
              prevEl:
                submenuContainer.parentElement.querySelector(".menu-nav-prev"),
            },
          });
        }, 10);
      },
      bottomMenuSlider = (bottomContainer) => {
        setTimeout(() => {
          let bottomMenuSlider = new Swiper(bottomContainer, {
            freeMode: false,
            direction: "horizontal",
            slidesPerView: "auto",
            slideToClickedSlide: false,
            roundLengths: true,
            spaceBetween: 0,
            navigation: {
              nextEl:
                bottomContainer.parentElement.querySelector(".menu-nav-next"),
              prevEl:
                bottomContainer.parentElement.querySelector(".menu-nav-prev"),
            },
          });

          const activeMenuIndex = [].indexOf.call(
            bottomContainer.querySelectorAll("ul>li"),
            bottomContainer.querySelector("ul>li.active-bottom-menu")
          );
          bottomMenuSlider.slideTo(activeMenuIndex, 500);
        }, 10);
      },
      adaptiveMenu = () => {
        const allitems = nav.querySelectorAll("li.item");
        const moreLi = navMenu.querySelector(".more");
        const moreBtn = moreLi.querySelector("a");
        const moreMenu = nav.querySelector(".more-menu");
        const moreMenuItems = moreMenu.querySelectorAll("li.item");

        // Remove "m-hidden" class from all items
        allitems.forEach((item) => item.classList.remove("m-hidden"));

        const menuItems2 = Array.from(menuItems);

        // Calculate total width of menu items
        const totalWidth = menuItems2.reduce(
          (acc, item) => acc + item.offsetWidth,
          0
        );

        // Determine stopWidth based on nav offsetWidth
        let stopWidth = totalWidth > nav.offsetWidth ? moreBtn.offsetWidth : 0;

        // Calculate navWidth based on screen width
        const navWidth = nav.offsetWidth;

        // Hide items that exceed navWidth
        let hiddenItems = [];
        menuItems2.forEach((item, i) => {
          item.classList.remove("m-hidden");

          if (navWidth >= stopWidth + item.offsetWidth) {
            console.log(navWidth, "navWidth");
            console.log(
              stopWidth + item.offsetWidth,
              "stopWidth + item.offsetWidth"
            );

            stopWidth += item.offsetWidth;
          } else {
            item.classList.add("m-hidden");
            hiddenItems.push(i);
          }
        });

        if (!hiddenItems.length) {
          moreLi.classList.add("m-hidden");
          nav.classList.remove("nav--dropped");
          header.classList.remove("header--active");
          moreBtn.setAttribute("aria-expanded", "false");
        } else {
          Array.prototype.forEach.call(moreMenuItems, (item, i) => {
            if (hiddenItems.indexOf(i) == -1) {
              item.classList.add("m-hidden");
            }
          });
        }

        Array.prototype.forEach.call(subMenu, (item, i) => {
          if (
            item.querySelectorAll(".swiper-slide").length >= 8 &&
            !detectMobile()
          ) {
            subMenuSlider(item.querySelector(".sub-menu__container"), i);
          } else {
            item
              .querySelector(".sub-menu__container")
              .parentElement.classList.add("native-swipe");
          }
        });

        !!bottomMenuNav && bottomMenuSlider(bottomMenuNav);

        subMenuSliderItem.forEach((element, i) => {
          subMenuSliderItem[i].update();
        });
      };

    navMenu.insertAdjacentHTML(
      "beforeend",
      `<li class="item more" data-title="Daha Fazla">
                        <a href="javascript:;" aria-haspopup="true" aria-expanded="false">
                          DAHA FAZLA
              </a>
              <ul class="more-menu">${navMenu.innerHTML}</ul>
            </li>`
    );

    setTimeout(() => {
      adaptiveMenu();
      nav.classList.remove("passive");
    }, 10);

    window.addEventListener(
      "resize",
      function (event) {
        if (!detectMobile()) {
          adaptiveMenu();
        }
      },
      true
    );

    window.addEventListener("scroll", (e) => {
      let offsetY = window.scrollY;
      if (offsetY <= 75) {
        document.body.classList.remove("header-fixed");
        header.classList.remove("header-fixed");
      } else {
        document.body.classList.add("header-fixed");
        header.classList.add("header-fixed");
      }

      if (offsetY <= 130) {
        document.body.classList.remove("header-fixed-active");
        header.classList.remove("header-fixed-active");
      } else {
        document.body.classList.add("header-fixed-active");
        header.classList.add("header-fixed-active");
      }
    });

    let scroll_up = window.scrollY;
    window.addEventListener("scroll", (e) => {
      const scroll_down = window.scrollY;
      const header__bottom = document.querySelector(".header__bottom-menu");

      const menuEuro2024 = document.querySelector(
        "body.euro-2024 .header__main-menu>ul>li:first-child .sub-menu"
      );
      if (scroll_down > scroll_up) {
        header__bottom.classList.add("down");
        if (menuEuro2024) menuEuro2024.classList.add("down");
      } else {
        header__bottom.classList.remove("down");
        if (menuEuro2024) menuEuro2024.classList.remove("down");
      }
      scroll_up = window.scrollY;
    });

    Array.prototype.forEach.call(subMenu, (item, i) => {
      if (!item.parentElement.classList.contains("has-submenu")) {
        item.parentElement.classList.add("has-submenu");
      }
    });

    let mobileSubMenu = navMenu.querySelectorAll(".has-submenu");
    Array.prototype.forEach.call(mobileSubMenu, (item, i) => {
      item.addEventListener("click", function (e) {
        console.log("selam");

        if (!detectMobile()) {
          return true;
        }

        if (this.classList.contains("opened-menu")) {
          // this.classList.remove("opened-menu");
        } else {
          this.classList.add("opened-menu");
        }
      });
    });

    document.body.addEventListener("click", (e) => {
      let targetElement = e.target;
      if (targetElement.classList.contains("backdrop")) {
        mobileMenu.classList.remove("active");
        document.body.classList.remove("mobile-menu-open");
        gh.BackDropServive.Close(document.body);
      }
    });

    mobileMenu.addEventListener("click", function (e) {
      e.preventDefault();
      let targetElement = e.target;
      if (targetElement.classList.contains("active")) {
        targetElement.classList.remove("active");
        document.body.classList.remove("mobile-menu-open");
        gh.BackDropServive.Close(document.body);
      } else {
        targetElement.classList.add("active");
        document.body.classList.add("mobile-menu-open");
        gh.BackDropServive.Open(document.body, 0, "#ddd");
      }
    });

    headerSearch
      .querySelector(".header__search__link")
      .addEventListener("click", (e) => {
        e.preventDefault();
        if (headerSearch.classList.contains("opened-search")) {
          headerSearch.classList.remove("opened-search");
        } else {
          headerSearch.classList.add("opened-search");
          headerSearch.querySelector("#txtSearchForm").focus();
        }
      });

    headerSearch
      .querySelector(".header__search__close")
      .addEventListener("click", (e) => {
        e.preventDefault();
        headerSearch.classList.remove("opened-search");
      });

    document.querySelectorAll("#txtSearchForm").forEach((input) => {
      input.addEventListener("keydown", (e) => {
        if (e.keyCode === 13) {
          location.href =
            location.origin + "/arama?q=" + encodeURIComponent(e.target.value);
        }
      });
    });

    var selectCurrentMenu = () => {
      if (window.location.pathname == "/") {
        return;
      }

      let items = navMenu.querySelectorAll(
        "[href='" + window.location.pathname + "']"
      );
      Array.prototype.forEach.call(items, (current) => {
        current.classList.add("active-menu");
        const closest = current.closest(".item");
        if (closest) {
          closest.classList.add("active-menu");
        }
      });

      if (bottomMenuNav) {
        let bottomMenuItems = bottomMenuNav.querySelectorAll(
          "[href='" + window.location.pathname + "']"
        );
        Array.prototype.forEach.call(bottomMenuItems, (current) => {
          current.classList.add("active-menu");
          current.parentElement.classList.add("active-bottom-menu");
          const closest = current.closest(".item");
          if (closest) {
            closest.classList.add("active-menu");
          }
        });

        let bottomMenuItemsTeam = bottomMenuNav.querySelector(
            "[href='" + window.location.pathname + "/futbol']"
          ),
          bottomMenuTeam =
            !!bottomMenuItemsTeam &&
            bottomMenuItemsTeam.classList.add("active-menu");
      }
    };

    selectCurrentMenu();
    Array.prototype.forEach.call(subMenu, (item, i) => {
      if (
        item.querySelectorAll(".swiper-slide").length >= 8 &&
        !detectMobile()
      ) {
        subMenuSlider(item.querySelector(".sub-menu__container"), i);
      } else {
        item
          .querySelector(".sub-menu__container")
          .parentElement.classList.add("native-swipe");
      }
    });

    !!bottomMenuNav && bottomMenuSlider(bottomMenuNav);

    const toggleButtons = document.querySelectorAll("[js-role='toggle']");

    Array.prototype.forEach.call(toggleButtons, (button) => {
      button.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        const target = button.getAttribute("data-toggle-target"),
          src = document.querySelector(`[data-toggle-src="${target}"]`);

        button.getAttribute("data-state") === "none"
          ? button.setAttribute("data-state", "clicked")
          : button.setAttribute("data-state", "none");

        src.getAttribute("data-visible") === "false"
          ? src.setAttribute("data-visible", "")
          : src.setAttribute("data-visible", "false");
      });
    });
  },
  initWeatherClick: () => {
    const cities = document.querySelectorAll(".cities-popup__city"),
      input = document.querySelector(".cities-popup__input"),
      selector = document.querySelector(".weather__selector");

    Array.prototype.forEach.call(cities, (city) => {
      city.addEventListener("click", (event) => {
        const cityId = event.target.getAttribute("data-city-id"),
          cityPlate = event.target.getAttribute("data-city-plate");
        gh.getWeatherData(cityId);
        milApp.initTrafficData(cityPlate);
        localStorage.setItem("cityId", cityId);
        input.value = "";
        selector.click();
      });
    });
  },
  initWeatherSearch: (keyword) => {
    const cities = document.querySelectorAll(".cities-popup__city"),
      citiesArr = [];
    let filteredCities;

    Array.prototype.forEach.call(cities, (city) => {
      citiesArr.push(city.getAttribute("data-city-name"));
      city.style.display = "none";
    });
    commonApp.helpers.startsWithInit();

    filteredCities = citiesArr.filter((city) =>
      city.startsWith(keyword.toLocaleLowerCase("tr"))
    );

    filteredCities.map((city) => {
      document.querySelector(`[data-city-name=${city}]`).style.display =
        "block";
    });
  },
  fixedMenuBar: {
    DetectScrollDirection: function () {
      this.lastScrollTop = 0;

      this.detect = function () {
        let scrollTop =
          window.pageYOffset || document.documentElement.scrollTop;

        if (Math.abs(this.lastScrollTop - scrollTop) <= 10) {
          return;
        }
        if (scrollTop > this.lastScrollTop) {
          this.lastScrollTop = scrollTop;
          return "down";
        } else if (scrollTop < this.lastScrollTop) {
          this.lastScrollTop = scrollTop;
          return "up";
        }
      };

      this.init = function () {
        return this.detect();
      };
    },
    addFixed: () => {
      const $menuContainer = document.querySelector(".menu-container"),
        wScrollTop = window.pageYOffset || document.documentElement.scrollTop;
      if (wScrollTop >= $menuContainer.offsetTop) {
        document.body.setAttribute("data-fixed-menu", "");
      } else {
        document.body.removeAttribute("data-fixed-menu");
      }
    },
    addScrollView: () => {
      document.body.classList.add("main-menu__scroll-view");
    },
    removeScrollView: () => {
      document.body.classList.remove("main-menu__scroll-view");
    },
    directionCondition: (direction) => {
      if (direction === "down") {
        gh.fixedMenuBar.addScrollView();
      } else if (direction === "up") {
        gh.fixedMenuBar.removeScrollView();
      }
    },
    initResize: () => {
      gh.fixedMenuBar.addFixed();
    },
    initScroll: (direction) => {
      const wScrollTop =
          window.pageYOffset || document.documentElement.scrollTop,
        $body = document.body,
        hasSubMenu = $body.getAttribute("data-page-type") === "has-sub",
        isHomePage = $body.classList.contains("home"),
        $menuContainer = document.querySelector(".menu-container"),
        $mainBar = $menuContainer.querySelector(".main-menu"),
        $mainBarNav = $mainBar.querySelector(".main-menu__nav"),
        $mobileBg = $menuContainer.querySelector(".mobile-row-1-bg");

      // Hamburger-Menu-aktif-ise
      if (document.querySelector("[data-hamburger-menu='active']")) {
        return false;
      }

      if (isHomePage) {
        // Anasayfasa
        if (wScrollTop >= $menuContainer.offsetTop + $mainBarNav.clientHeight) {
          gh.fixedMenuBar.addScrollView();
        } else {
          gh.fixedMenuBar.removeScrollView();
        }
      } else {
        // Anasayfa-Degilse
        if (hasSubMenu) {
          // Kategori-Menu-Varsa
          if (wScrollTop >= $menuContainer.offsetTop + $mainBar.clientHeight) {
            gh.fixedMenuBar.directionCondition(direction);
          } else {
            gh.fixedMenuBar.removeScrollView();
          }
        } else {
          // Kategori-Menu-Yoksa
          if (wScrollTop >= $menuContainer.offsetTop + $mobileBg.clientHeight) {
            gh.fixedMenuBar.directionCondition(direction);
          } else {
            gh.fixedMenuBar.removeScrollView();
          }
        }
      }
    },
    init: () => {
      // Headerin icinde Ekonomi Bar var mi
      if (
        document
          .querySelector(".global-header")
          .firstElementChild.classList.contains("container--currency-weather")
      ) {
        document.body.classList.add("has-economy-bar");
      }

      // Fixed mi Degil mi
      gh.fixedMenuBar.addFixed();

      // Scroll Yon Durumu Icin DetectScrollDirection Constructor Fonksiyon Instance ı Tanimlaniyor
      let scrollDirection = new gh.fixedMenuBar.DetectScrollDirection();

      // Resize
      window.addEventListener("resize", function () {
        gh.fixedMenuBar.initResize();
      });

      // Scroll
      window.addEventListener("scroll", function () {
        const direction = scrollDirection.init();

        gh.fixedMenuBar.addFixed();

        gh.fixedMenuBar.initScroll(direction);
      });
    },
  },
  BackDropServive: {
    Open: (container, zIndex, color = "#000") => {
      let $self = this,
        bdZIndex;

      if (zIndex) {
        bdZIndex = zIndex;
      } else {
        bdZIndex = 1;
      }

      if (document.querySelectorAll(".backdrop").length === 0) {
        container.insertAdjacentHTML(
          "beforeend",
          '<div class="backdrop active"></div>'
        );
        container.querySelector(".backdrop").style.zIndex = bdZIndex;
        container
          .querySelector(".backdrop")
          .addEventListener("touchstart", () => {
            $self.Close(this.container);
          });
      } else {
        container.querySelector(".backdrop").style.zIndex = bdZIndex;
        container.querySelector(".backdrop").classList.add("active");
      }
    },
    Close: (container) => {
      container.querySelector(".backdrop").classList.remove("active");
      container.querySelector(".backdrop").removeAttribute("style");
    },
  },
  pageSkinSetPosition: () => {
    const footer = document.querySelector(".global-footer");
    if (footer.classList.contains("hidden") || !footer) {
      return;
    }
    var fixture = document.querySelector(".horizontal-fixture"),
      bottomMenu = document.querySelector(".header__bottom-menu")
        ? document.querySelector(".header__bottom-menu").offsetHeight
        : 0,
      pageSkin = [
        ".pageskin--left",
        ".pageskin--right",
        "#Medyanet_Ad_Models_Pageskin_BannerLeft",
        "#Medyanet_Ad_Models_Pageskin_BannerRight",
      ],
      maxHeight = [];
    for (let i = 0, length = pageSkin.length; i < length; i++) {
      maxHeight.push(document.querySelector(pageSkin[i]).offsetHeight);
    }

    maxHeight = Math.max(...maxHeight);
    for (let i = 0, length = pageSkin.length; i < length; i++) {
      const element = document.querySelector(pageSkin[i]);

      if (element && footer) {
        const limit =
          footer.offsetTop -
          maxHeight -
          (fixture ? fixture.offsetHeight + 115 : 115);
        if (window.scrollY > limit) {
          let calc = footer.offsetTop - maxHeight - 330;
          element.style.position = "absolute";
          element.style.top = calc + bottomMenu + "px";
        } else {
          element.style.position = "fixed";
          element.style.top = fixture
            ? fixture.offsetHeight + 80 + bottomMenu + "px"
            : bottomMenu + 80 + "px";
        }
      } else {
        if (element) {
          element.style.position = "fixed";
          element.style.top = fixture
            ? fixture.offsetHeight + bottomMenu + 80 + "px"
            : bottomMenu + 80 + "px";
        }
      }
    }
  },
  pageSkinScrollTarget: () => {
    setTimeout(() => {
      var pageSkinContainer = document.querySelector(".pageskin__container");
      pageSkinContainer && pageSkinContainer.classList.add("visibled");
    }, 1000);

    if (document.querySelectorAll(".nd-article-container").length === 0) {
      // news detail ignore
      gh.pageSkinSetPosition();

      window.onscroll = function () {
        gh.pageSkinSetPosition();
      };
    }
  },
};
