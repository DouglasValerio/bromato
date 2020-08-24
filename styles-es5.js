(function () {
  (window["webpackJsonp"] = window["webpackJsonp"] || []).push([["styles"], {
    /***/
    "./node_modules/@angular-builders/custom-webpack/node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js":
    /*!**************************************************************************************************************************!*\
      !*** ./node_modules/@angular-builders/custom-webpack/node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js ***!
      \**************************************************************************************************************************/

    /*! no static exports found */

    /***/
    function node_modulesAngularBuildersCustomWebpackNode_modulesStyleLoaderDistRuntimeInjectStylesIntoStyleTagJs(module, exports, __webpack_require__) {
      "use strict";

      var isOldIE = function isOldIE() {
        var memo;
        return function memorize() {
          if (typeof memo === 'undefined') {
            // Test for IE <= 9 as proposed by Browserhacks
            // @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
            // Tests for existence of standard globals is to allow style-loader
            // to operate correctly into non-standard environments
            // @see https://github.com/webpack-contrib/style-loader/issues/177
            memo = Boolean(window && document && document.all && !window.atob);
          }

          return memo;
        };
      }();

      var getTarget = function getTarget() {
        var memo = {};
        return function memorize(target) {
          if (typeof memo[target] === 'undefined') {
            var styleTarget = document.querySelector(target); // Special case to return head of iframe instead of iframe itself

            if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
              try {
                // This will throw an exception if access to iframe is blocked
                // due to cross-origin restrictions
                styleTarget = styleTarget.contentDocument.head;
              } catch (e) {
                // istanbul ignore next
                styleTarget = null;
              }
            }

            memo[target] = styleTarget;
          }

          return memo[target];
        };
      }();

      var stylesInDom = [];

      function getIndexByIdentifier(identifier) {
        var result = -1;

        for (var i = 0; i < stylesInDom.length; i++) {
          if (stylesInDom[i].identifier === identifier) {
            result = i;
            break;
          }
        }

        return result;
      }

      function modulesToDom(list, options) {
        var idCountMap = {};
        var identifiers = [];

        for (var i = 0; i < list.length; i++) {
          var item = list[i];
          var id = options.base ? item[0] + options.base : item[0];
          var count = idCountMap[id] || 0;
          var identifier = "".concat(id, " ").concat(count);
          idCountMap[id] = count + 1;
          var index = getIndexByIdentifier(identifier);
          var obj = {
            css: item[1],
            media: item[2],
            sourceMap: item[3]
          };

          if (index !== -1) {
            stylesInDom[index].references++;
            stylesInDom[index].updater(obj);
          } else {
            stylesInDom.push({
              identifier: identifier,
              updater: addStyle(obj, options),
              references: 1
            });
          }

          identifiers.push(identifier);
        }

        return identifiers;
      }

      function insertStyleElement(options) {
        var style = document.createElement('style');
        var attributes = options.attributes || {};

        if (typeof attributes.nonce === 'undefined') {
          var nonce = true ? __webpack_require__.nc : undefined;

          if (nonce) {
            attributes.nonce = nonce;
          }
        }

        Object.keys(attributes).forEach(function (key) {
          style.setAttribute(key, attributes[key]);
        });

        if (typeof options.insert === 'function') {
          options.insert(style);
        } else {
          var target = getTarget(options.insert || 'head');

          if (!target) {
            throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
          }

          target.appendChild(style);
        }

        return style;
      }

      function removeStyleElement(style) {
        // istanbul ignore if
        if (style.parentNode === null) {
          return false;
        }

        style.parentNode.removeChild(style);
      }
      /* istanbul ignore next  */


      var replaceText = function replaceText() {
        var textStore = [];
        return function replace(index, replacement) {
          textStore[index] = replacement;
          return textStore.filter(Boolean).join('\n');
        };
      }();

      function applyToSingletonTag(style, index, remove, obj) {
        var css = remove ? '' : obj.media ? "@media ".concat(obj.media, " {").concat(obj.css, "}") : obj.css; // For old IE

        /* istanbul ignore if  */

        if (style.styleSheet) {
          style.styleSheet.cssText = replaceText(index, css);
        } else {
          var cssNode = document.createTextNode(css);
          var childNodes = style.childNodes;

          if (childNodes[index]) {
            style.removeChild(childNodes[index]);
          }

          if (childNodes.length) {
            style.insertBefore(cssNode, childNodes[index]);
          } else {
            style.appendChild(cssNode);
          }
        }
      }

      function applyToTag(style, options, obj) {
        var css = obj.css;
        var media = obj.media;
        var sourceMap = obj.sourceMap;

        if (media) {
          style.setAttribute('media', media);
        } else {
          style.removeAttribute('media');
        }

        if (sourceMap && btoa) {
          css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
        } // For old IE

        /* istanbul ignore if  */


        if (style.styleSheet) {
          style.styleSheet.cssText = css;
        } else {
          while (style.firstChild) {
            style.removeChild(style.firstChild);
          }

          style.appendChild(document.createTextNode(css));
        }
      }

      var singleton = null;
      var singletonCounter = 0;

      function addStyle(obj, options) {
        var style;
        var update;
        var remove;

        if (options.singleton) {
          var styleIndex = singletonCounter++;
          style = singleton || (singleton = insertStyleElement(options));
          update = applyToSingletonTag.bind(null, style, styleIndex, false);
          remove = applyToSingletonTag.bind(null, style, styleIndex, true);
        } else {
          style = insertStyleElement(options);
          update = applyToTag.bind(null, style, options);

          remove = function remove() {
            removeStyleElement(style);
          };
        }

        update(obj);
        return function updateStyle(newObj) {
          if (newObj) {
            if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap) {
              return;
            }

            update(obj = newObj);
          } else {
            remove();
          }
        };
      }

      module.exports = function (list, options) {
        options = options || {}; // Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
        // tags it will allow on a page

        if (!options.singleton && typeof options.singleton !== 'boolean') {
          options.singleton = isOldIE();
        }

        list = list || [];
        var lastIdentifiers = modulesToDom(list, options);
        return function update(newList) {
          newList = newList || [];

          if (Object.prototype.toString.call(newList) !== '[object Array]') {
            return;
          }

          for (var i = 0; i < lastIdentifiers.length; i++) {
            var identifier = lastIdentifiers[i];
            var index = getIndexByIdentifier(identifier);
            stylesInDom[index].references--;
          }

          var newLastIdentifiers = modulesToDom(newList, options);

          for (var _i = 0; _i < lastIdentifiers.length; _i++) {
            var _identifier = lastIdentifiers[_i];

            var _index = getIndexByIdentifier(_identifier);

            if (stylesInDom[_index].references === 0) {
              stylesInDom[_index].updater();

              stylesInDom.splice(_index, 1);
            }
          }

          lastIdentifiers = newLastIdentifiers;
        };
      };
      /***/

    },

    /***/
    "./node_modules/css-loader/dist/cjs.js?!./node_modules/postcss-loader/src/index.js?!./node_modules/ngx-ui-switch/ui-switch.component.css":
    /*!*********************************************************************************************************************************************************!*\
      !*** ./node_modules/css-loader/dist/cjs.js??ref--13-1!./node_modules/postcss-loader/src??embedded!./node_modules/ngx-ui-switch/ui-switch.component.css ***!
      \*********************************************************************************************************************************************************/

    /*! no static exports found */

    /***/
    function node_modulesCssLoaderDistCjsJsNode_modulesPostcssLoaderSrcIndexJsNode_modulesNgxUiSwitchUiSwitchComponentCss(module, exports, __webpack_require__) {
      // Imports
      var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(
      /*! ../css-loader/dist/runtime/api.js */
      "./node_modules/css-loader/dist/runtime/api.js");

      exports = ___CSS_LOADER_API_IMPORT___(true); // Module

      exports.push([module.i, ".switch.switch-small {\n  min-width: 33px; }\n\n.switch.switch-medium {\n  min-width: 50px; }\n\n.switch.switch-large {\n  min-width: 60px; }\n\n.switch.switch-small > .switch-pane > span {\n  font-size: 9px; }\n\n.switch.switch-medium > .switch-pane > span {\n  font-size: 16px; }\n\n.switch.switch-large > .switch-pane > span {\n  font-size: 16px; }\n\n.switch {\n  border: 1px solid #dfdfdf;\n  position: relative;\n  display: inline-block;\n  box-sizing: content-box;\n  padding: 0;\n  margin: 0;\n  cursor: pointer;\n  box-shadow: #dfdfdf 0 0 0 0 inset;\n  transition: 0.3s ease-out all;\n  -webkit-transition: 0.3s ease-out all;\n  white-space: nowrap; }\n\n.switch small {\n    border-radius: 100%;\n    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);\n    position: absolute;\n    top: 0;\n    right: calc(100% - 30px);\n    transition: 0.3s ease-out all;\n    -webkit-transition: 0.3s ease-out all;\n    background: #fff;\n    display: flex;\n    align-items: center;\n    justify-content: center; }\n\n.switch.switch-small {\n    height: 20px;\n    border-radius: 20px; }\n\n.switch.switch-small small {\n      width: 20px;\n      height: 20px;\n      right: calc(100% - 20px); }\n\n.switch.switch-small > .switch-pane > span {\n      line-height: 20px; }\n\n.switch.switch-small > .switch-pane .switch-label-checked {\n      padding-right: 25px;\n      padding-left: 10px; }\n\n.switch.switch-small > .switch-pane .switch-label-unchecked {\n      padding-left: 25px;\n      padding-right: 10px; }\n\n.switch.switch-medium {\n    height: 30px;\n    border-radius: 30px; }\n\n.switch.switch-medium small {\n      width: 30px;\n      height: 30px;\n      right: calc(100% - 30px); }\n\n.switch.switch-medium > .switch-pane > span {\n      line-height: 30px; }\n\n.switch.switch-medium > .switch-pane .switch-label-checked {\n      padding-right: 35px;\n      padding-left: 15px; }\n\n.switch.switch-medium > .switch-pane .switch-label-unchecked {\n      padding-left: 35px;\n      padding-right: 15px; }\n\n.switch.switch-large {\n    height: 40px;\n    border-radius: 40px; }\n\n.switch.switch-large small {\n      width: 40px;\n      height: 40px;\n      right: calc(100% - 40px); }\n\n.switch.switch-large > .switch-pane > span {\n      line-height: 40px; }\n\n.switch.switch-large > .switch-pane .switch-label-checked {\n      padding-right: 45px;\n      padding-left: 20px; }\n\n.switch.switch-large > .switch-pane .switch-label-unchecked {\n      padding-left: 45px;\n      padding-right: 20px; }\n\n.switch.checked {\n    background: #64bd63; }\n\n.switch.checked small {\n      right: 0;\n      left: auto; }\n\n.switch.checked .switch-pane {\n      top: 0; }\n\n.switch.checked .switch-pane .switch-label-checked {\n        display: block; }\n\n.switch.checked .switch-pane .switch-label-unchecked {\n        display: none; }\n\n.switch.disabled {\n    opacity: 0.5;\n    cursor: not-allowed; }\n\n.switch .switch-pane {\n    display: flex;\n    flex-direction: column;\n    height: 100%;\n    min-height: 100%;\n    justify-content: flex-start;\n    align-items: center;\n    top: 0;\n    position: relative;\n    pointer-events: none; }\n\n.switch .switch-pane > span {\n      display: block;\n      min-height: 100%; }\n\n.switch .switch-pane .switch-label {\n      color: black; }\n\n.switch .switch-pane .switch-label-checked {\n        display: none; }\n\n.switch .switch-pane .switch-label-unchecked {\n        display: block; }\n\n.switch.loading {\n    background-color: #f1f1f1; }\n\n.switch.loading small {\n      background-color: transparent;\n      border: none;\n      box-shadow: none;\n      right: 50%;\n      transform: translateX(50%); }\n\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9uZ3gtdWktc3dpdGNoL3VpLXN3aXRjaC5jb21wb25lbnQuY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0UsZUFBZSxFQUFFOztBQUVuQjtFQUNFLGVBQWUsRUFBRTs7QUFFbkI7RUFDRSxlQUFlLEVBQUU7O0FBRW5CO0VBQ0UsY0FBYyxFQUFFOztBQUVsQjtFQUNFLGVBQWUsRUFBRTs7QUFFbkI7RUFDRSxlQUFlLEVBQUU7O0FBRW5CO0VBQ0UseUJBQXlCO0VBQ3pCLGtCQUFrQjtFQUNsQixxQkFBcUI7RUFDckIsdUJBQXVCO0VBQ3ZCLFVBQVU7RUFDVixTQUFTO0VBQ1QsZUFBZTtFQUNmLGlDQUFpQztFQUNqQyw2QkFBNkI7RUFDN0IscUNBQXFDO0VBQ3JDLG1CQUFtQixFQUFFOztBQUNyQjtJQUNFLG1CQUFtQjtJQUNuQix3Q0FBd0M7SUFDeEMsa0JBQWtCO0lBQ2xCLE1BQU07SUFDTix3QkFBd0I7SUFDeEIsNkJBQTZCO0lBQzdCLHFDQUFxQztJQUNyQyxnQkFBZ0I7SUFDaEIsYUFBYTtJQUNiLG1CQUFtQjtJQUNuQix1QkFBdUIsRUFBRTs7QUFDM0I7SUFDRSxZQUFZO0lBQ1osbUJBQW1CLEVBQUU7O0FBQ3JCO01BQ0UsV0FBVztNQUNYLFlBQVk7TUFDWix3QkFBd0IsRUFBRTs7QUFDNUI7TUFDRSxpQkFBaUIsRUFBRTs7QUFDckI7TUFDRSxtQkFBbUI7TUFDbkIsa0JBQWtCLEVBQUU7O0FBQ3RCO01BQ0Usa0JBQWtCO01BQ2xCLG1CQUFtQixFQUFFOztBQUN6QjtJQUNFLFlBQVk7SUFDWixtQkFBbUIsRUFBRTs7QUFDckI7TUFDRSxXQUFXO01BQ1gsWUFBWTtNQUNaLHdCQUF3QixFQUFFOztBQUM1QjtNQUNFLGlCQUFpQixFQUFFOztBQUNyQjtNQUNFLG1CQUFtQjtNQUNuQixrQkFBa0IsRUFBRTs7QUFDdEI7TUFDRSxrQkFBa0I7TUFDbEIsbUJBQW1CLEVBQUU7O0FBQ3pCO0lBQ0UsWUFBWTtJQUNaLG1CQUFtQixFQUFFOztBQUNyQjtNQUNFLFdBQVc7TUFDWCxZQUFZO01BQ1osd0JBQXdCLEVBQUU7O0FBQzVCO01BQ0UsaUJBQWlCLEVBQUU7O0FBQ3JCO01BQ0UsbUJBQW1CO01BQ25CLGtCQUFrQixFQUFFOztBQUN0QjtNQUNFLGtCQUFrQjtNQUNsQixtQkFBbUIsRUFBRTs7QUFDekI7SUFDRSxtQkFBbUIsRUFBRTs7QUFDckI7TUFDRSxRQUFRO01BQ1IsVUFBVSxFQUFFOztBQUNkO01BQ0UsTUFBTSxFQUFFOztBQUNSO1FBQ0UsY0FBYyxFQUFFOztBQUNsQjtRQUNFLGFBQWEsRUFBRTs7QUFDckI7SUFDRSxZQUFZO0lBQ1osbUJBQW1CLEVBQUU7O0FBQ3ZCO0lBQ0UsYUFBYTtJQUNiLHNCQUFzQjtJQUN0QixZQUFZO0lBQ1osZ0JBQWdCO0lBQ2hCLDJCQUEyQjtJQUMzQixtQkFBbUI7SUFDbkIsTUFBTTtJQUNOLGtCQUFrQjtJQUNsQixvQkFBb0IsRUFBRTs7QUFDdEI7TUFDRSxjQUFjO01BQ2QsZ0JBQWdCLEVBQUU7O0FBQ3BCO01BQ0UsWUFBWSxFQUFFOztBQUNkO1FBQ0UsYUFBYSxFQUFFOztBQUNqQjtRQUNFLGNBQWMsRUFBRTs7QUFDdEI7SUFDRSx5QkFBeUIsRUFBRTs7QUFDM0I7TUFDRSw2QkFBNkI7TUFDN0IsWUFBWTtNQUNaLGdCQUFnQjtNQUNoQixVQUFVO01BQ1YsMEJBQTBCLEVBQUUiLCJmaWxlIjoibm9kZV9tb2R1bGVzL25neC11aS1zd2l0Y2gvdWktc3dpdGNoLmNvbXBvbmVudC5jc3MiLCJzb3VyY2VzQ29udGVudCI6WyIuc3dpdGNoLnN3aXRjaC1zbWFsbCB7XG4gIG1pbi13aWR0aDogMzNweDsgfVxuXG4uc3dpdGNoLnN3aXRjaC1tZWRpdW0ge1xuICBtaW4td2lkdGg6IDUwcHg7IH1cblxuLnN3aXRjaC5zd2l0Y2gtbGFyZ2Uge1xuICBtaW4td2lkdGg6IDYwcHg7IH1cblxuLnN3aXRjaC5zd2l0Y2gtc21hbGwgPiAuc3dpdGNoLXBhbmUgPiBzcGFuIHtcbiAgZm9udC1zaXplOiA5cHg7IH1cblxuLnN3aXRjaC5zd2l0Y2gtbWVkaXVtID4gLnN3aXRjaC1wYW5lID4gc3BhbiB7XG4gIGZvbnQtc2l6ZTogMTZweDsgfVxuXG4uc3dpdGNoLnN3aXRjaC1sYXJnZSA+IC5zd2l0Y2gtcGFuZSA+IHNwYW4ge1xuICBmb250LXNpemU6IDE2cHg7IH1cblxuLnN3aXRjaCB7XG4gIGJvcmRlcjogMXB4IHNvbGlkICNkZmRmZGY7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xuICBib3gtc2l6aW5nOiBjb250ZW50LWJveDtcbiAgcGFkZGluZzogMDtcbiAgbWFyZ2luOiAwO1xuICBjdXJzb3I6IHBvaW50ZXI7XG4gIGJveC1zaGFkb3c6ICNkZmRmZGYgMCAwIDAgMCBpbnNldDtcbiAgdHJhbnNpdGlvbjogMC4zcyBlYXNlLW91dCBhbGw7XG4gIC13ZWJraXQtdHJhbnNpdGlvbjogMC4zcyBlYXNlLW91dCBhbGw7XG4gIHdoaXRlLXNwYWNlOiBub3dyYXA7IH1cbiAgLnN3aXRjaCBzbWFsbCB7XG4gICAgYm9yZGVyLXJhZGl1czogMTAwJTtcbiAgICBib3gtc2hhZG93OiAwIDFweCAzcHggcmdiYSgwLCAwLCAwLCAwLjQpO1xuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICB0b3A6IDA7XG4gICAgcmlnaHQ6IGNhbGMoMTAwJSAtIDMwcHgpO1xuICAgIHRyYW5zaXRpb246IDAuM3MgZWFzZS1vdXQgYWxsO1xuICAgIC13ZWJraXQtdHJhbnNpdGlvbjogMC4zcyBlYXNlLW91dCBhbGw7XG4gICAgYmFja2dyb3VuZDogI2ZmZjtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7IH1cbiAgLnN3aXRjaC5zd2l0Y2gtc21hbGwge1xuICAgIGhlaWdodDogMjBweDtcbiAgICBib3JkZXItcmFkaXVzOiAyMHB4OyB9XG4gICAgLnN3aXRjaC5zd2l0Y2gtc21hbGwgc21hbGwge1xuICAgICAgd2lkdGg6IDIwcHg7XG4gICAgICBoZWlnaHQ6IDIwcHg7XG4gICAgICByaWdodDogY2FsYygxMDAlIC0gMjBweCk7IH1cbiAgICAuc3dpdGNoLnN3aXRjaC1zbWFsbCA+IC5zd2l0Y2gtcGFuZSA+IHNwYW4ge1xuICAgICAgbGluZS1oZWlnaHQ6IDIwcHg7IH1cbiAgICAuc3dpdGNoLnN3aXRjaC1zbWFsbCA+IC5zd2l0Y2gtcGFuZSAuc3dpdGNoLWxhYmVsLWNoZWNrZWQge1xuICAgICAgcGFkZGluZy1yaWdodDogMjVweDtcbiAgICAgIHBhZGRpbmctbGVmdDogMTBweDsgfVxuICAgIC5zd2l0Y2guc3dpdGNoLXNtYWxsID4gLnN3aXRjaC1wYW5lIC5zd2l0Y2gtbGFiZWwtdW5jaGVja2VkIHtcbiAgICAgIHBhZGRpbmctbGVmdDogMjVweDtcbiAgICAgIHBhZGRpbmctcmlnaHQ6IDEwcHg7IH1cbiAgLnN3aXRjaC5zd2l0Y2gtbWVkaXVtIHtcbiAgICBoZWlnaHQ6IDMwcHg7XG4gICAgYm9yZGVyLXJhZGl1czogMzBweDsgfVxuICAgIC5zd2l0Y2guc3dpdGNoLW1lZGl1bSBzbWFsbCB7XG4gICAgICB3aWR0aDogMzBweDtcbiAgICAgIGhlaWdodDogMzBweDtcbiAgICAgIHJpZ2h0OiBjYWxjKDEwMCUgLSAzMHB4KTsgfVxuICAgIC5zd2l0Y2guc3dpdGNoLW1lZGl1bSA+IC5zd2l0Y2gtcGFuZSA+IHNwYW4ge1xuICAgICAgbGluZS1oZWlnaHQ6IDMwcHg7IH1cbiAgICAuc3dpdGNoLnN3aXRjaC1tZWRpdW0gPiAuc3dpdGNoLXBhbmUgLnN3aXRjaC1sYWJlbC1jaGVja2VkIHtcbiAgICAgIHBhZGRpbmctcmlnaHQ6IDM1cHg7XG4gICAgICBwYWRkaW5nLWxlZnQ6IDE1cHg7IH1cbiAgICAuc3dpdGNoLnN3aXRjaC1tZWRpdW0gPiAuc3dpdGNoLXBhbmUgLnN3aXRjaC1sYWJlbC11bmNoZWNrZWQge1xuICAgICAgcGFkZGluZy1sZWZ0OiAzNXB4O1xuICAgICAgcGFkZGluZy1yaWdodDogMTVweDsgfVxuICAuc3dpdGNoLnN3aXRjaC1sYXJnZSB7XG4gICAgaGVpZ2h0OiA0MHB4O1xuICAgIGJvcmRlci1yYWRpdXM6IDQwcHg7IH1cbiAgICAuc3dpdGNoLnN3aXRjaC1sYXJnZSBzbWFsbCB7XG4gICAgICB3aWR0aDogNDBweDtcbiAgICAgIGhlaWdodDogNDBweDtcbiAgICAgIHJpZ2h0OiBjYWxjKDEwMCUgLSA0MHB4KTsgfVxuICAgIC5zd2l0Y2guc3dpdGNoLWxhcmdlID4gLnN3aXRjaC1wYW5lID4gc3BhbiB7XG4gICAgICBsaW5lLWhlaWdodDogNDBweDsgfVxuICAgIC5zd2l0Y2guc3dpdGNoLWxhcmdlID4gLnN3aXRjaC1wYW5lIC5zd2l0Y2gtbGFiZWwtY2hlY2tlZCB7XG4gICAgICBwYWRkaW5nLXJpZ2h0OiA0NXB4O1xuICAgICAgcGFkZGluZy1sZWZ0OiAyMHB4OyB9XG4gICAgLnN3aXRjaC5zd2l0Y2gtbGFyZ2UgPiAuc3dpdGNoLXBhbmUgLnN3aXRjaC1sYWJlbC11bmNoZWNrZWQge1xuICAgICAgcGFkZGluZy1sZWZ0OiA0NXB4O1xuICAgICAgcGFkZGluZy1yaWdodDogMjBweDsgfVxuICAuc3dpdGNoLmNoZWNrZWQge1xuICAgIGJhY2tncm91bmQ6ICM2NGJkNjM7IH1cbiAgICAuc3dpdGNoLmNoZWNrZWQgc21hbGwge1xuICAgICAgcmlnaHQ6IDA7XG4gICAgICBsZWZ0OiBhdXRvOyB9XG4gICAgLnN3aXRjaC5jaGVja2VkIC5zd2l0Y2gtcGFuZSB7XG4gICAgICB0b3A6IDA7IH1cbiAgICAgIC5zd2l0Y2guY2hlY2tlZCAuc3dpdGNoLXBhbmUgLnN3aXRjaC1sYWJlbC1jaGVja2VkIHtcbiAgICAgICAgZGlzcGxheTogYmxvY2s7IH1cbiAgICAgIC5zd2l0Y2guY2hlY2tlZCAuc3dpdGNoLXBhbmUgLnN3aXRjaC1sYWJlbC11bmNoZWNrZWQge1xuICAgICAgICBkaXNwbGF5OiBub25lOyB9XG4gIC5zd2l0Y2guZGlzYWJsZWQge1xuICAgIG9wYWNpdHk6IDAuNTtcbiAgICBjdXJzb3I6IG5vdC1hbGxvd2VkOyB9XG4gIC5zd2l0Y2ggLnN3aXRjaC1wYW5lIHtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAgaGVpZ2h0OiAxMDAlO1xuICAgIG1pbi1oZWlnaHQ6IDEwMCU7XG4gICAganVzdGlmeS1jb250ZW50OiBmbGV4LXN0YXJ0O1xuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgdG9wOiAwO1xuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgICBwb2ludGVyLWV2ZW50czogbm9uZTsgfVxuICAgIC5zd2l0Y2ggLnN3aXRjaC1wYW5lID4gc3BhbiB7XG4gICAgICBkaXNwbGF5OiBibG9jaztcbiAgICAgIG1pbi1oZWlnaHQ6IDEwMCU7IH1cbiAgICAuc3dpdGNoIC5zd2l0Y2gtcGFuZSAuc3dpdGNoLWxhYmVsIHtcbiAgICAgIGNvbG9yOiBibGFjazsgfVxuICAgICAgLnN3aXRjaCAuc3dpdGNoLXBhbmUgLnN3aXRjaC1sYWJlbC1jaGVja2VkIHtcbiAgICAgICAgZGlzcGxheTogbm9uZTsgfVxuICAgICAgLnN3aXRjaCAuc3dpdGNoLXBhbmUgLnN3aXRjaC1sYWJlbC11bmNoZWNrZWQge1xuICAgICAgICBkaXNwbGF5OiBibG9jazsgfVxuICAuc3dpdGNoLmxvYWRpbmcge1xuICAgIGJhY2tncm91bmQtY29sb3I6ICNmMWYxZjE7IH1cbiAgICAuc3dpdGNoLmxvYWRpbmcgc21hbGwge1xuICAgICAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7XG4gICAgICBib3JkZXI6IG5vbmU7XG4gICAgICBib3gtc2hhZG93OiBub25lO1xuICAgICAgcmlnaHQ6IDUwJTtcbiAgICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWCg1MCUpOyB9XG4iXX0= */", "", {
        "version": 3,
        "sources": ["node_modules/ngx-ui-switch/ui-switch.component.css", "ui-switch.component.css"],
        "names": [],
        "mappings": "AAAA;EACE,eAAe,EAAE;;AAEnB;EACE,eAAe,EAAE;;AAEnB;EACE,eAAe,EAAE;;AAEnB;EACE,cAAc,EAAE;;AAElB;EACE,eAAe,EAAE;;AAEnB;EACE,eAAe,EAAE;;AAEnB;EACE,yBAAyB;EACzB,kBAAkB;EAClB,qBAAqB;EACrB,uBAAuB;EACvB,UAAU;EACV,SAAS;EACT,eAAe;EACf,iCAAiC;EACjC,6BAA6B;EAC7B,qCAAqC;EACrC,mBAAmB,EAAE;;AACrB;IACE,mBAAmB;IACnB,wCAAwC;IACxC,kBAAkB;IAClB,MAAM;IACN,wBAAwB;IACxB,6BAA6B;IAC7B,qCAAqC;IACrC,gBAAgB;IAChB,aAAa;IACb,mBAAmB;IACnB,uBAAuB,EAAE;;AAC3B;IACE,YAAY;IACZ,mBAAmB,EAAE;;AACrB;MACE,WAAW;MACX,YAAY;MACZ,wBAAwB,EAAE;;AAC5B;MACE,iBAAiB,EAAE;;AACrB;MACE,mBAAmB;MACnB,kBAAkB,EAAE;;AACtB;MACE,kBAAkB;MAClB,mBAAmB,EAAE;;AACzB;IACE,YAAY;IACZ,mBAAmB,EAAE;;AACrB;MACE,WAAW;MACX,YAAY;MACZ,wBAAwB,EAAE;;AAC5B;MACE,iBAAiB,EAAE;;AACrB;MACE,mBAAmB;MACnB,kBAAkB,EAAE;;AACtB;MACE,kBAAkB;MAClB,mBAAmB,EAAE;;AACzB;IACE,YAAY;IACZ,mBAAmB,EAAE;;AACrB;MACE,WAAW;MACX,YAAY;MACZ,wBAAwB,EAAE;;AAC5B;MACE,iBAAiB,EAAE;;AACrB;MACE,mBAAmB;MACnB,kBAAkB,EAAE;;AACtB;MACE,kBAAkB;MAClB,mBAAmB,EAAE;;AACzB;IACE,mBAAmB,EAAE;;AACrB;MACE,QAAQ;MACR,UAAU,EAAE;;AACd;MACE,MAAM,EAAE;;AACR;QACE,cAAc,EAAE;;AAClB;QACE,aAAa,EAAE;;AACrB;IACE,YAAY;IACZ,mBAAmB,EAAE;;AACvB;IACE,aAAa;IACb,sBAAsB;IACtB,YAAY;IACZ,gBAAgB;IAChB,2BAA2B;IAC3B,mBAAmB;IACnB,MAAM;IACN,kBAAkB;IAClB,oBAAoB,EAAE;;AACtB;MACE,cAAc;MACd,gBAAgB,EAAE;;AACpB;MACE,YAAY,EAAE;;AACd;QACE,aAAa,EAAE;;AACjB;QACE,cAAc,EAAE;;AACtB;IACE,yBAAyB,EAAE;;AAC3B;MACE,6BAA6B;MAC7B,YAAY;MACZ,gBAAgB;MAChB,UAAU;MACV,0BAA0B,EAAE;;AC+BlC,4+NAA4+N",
        "file": "ui-switch.component.css",
        "sourcesContent": [".switch.switch-small {\n  min-width: 33px; }\n\n.switch.switch-medium {\n  min-width: 50px; }\n\n.switch.switch-large {\n  min-width: 60px; }\n\n.switch.switch-small > .switch-pane > span {\n  font-size: 9px; }\n\n.switch.switch-medium > .switch-pane > span {\n  font-size: 16px; }\n\n.switch.switch-large > .switch-pane > span {\n  font-size: 16px; }\n\n.switch {\n  border: 1px solid #dfdfdf;\n  position: relative;\n  display: inline-block;\n  box-sizing: content-box;\n  padding: 0;\n  margin: 0;\n  cursor: pointer;\n  box-shadow: #dfdfdf 0 0 0 0 inset;\n  transition: 0.3s ease-out all;\n  -webkit-transition: 0.3s ease-out all;\n  white-space: nowrap; }\n  .switch small {\n    border-radius: 100%;\n    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);\n    position: absolute;\n    top: 0;\n    right: calc(100% - 30px);\n    transition: 0.3s ease-out all;\n    -webkit-transition: 0.3s ease-out all;\n    background: #fff;\n    display: flex;\n    align-items: center;\n    justify-content: center; }\n  .switch.switch-small {\n    height: 20px;\n    border-radius: 20px; }\n    .switch.switch-small small {\n      width: 20px;\n      height: 20px;\n      right: calc(100% - 20px); }\n    .switch.switch-small > .switch-pane > span {\n      line-height: 20px; }\n    .switch.switch-small > .switch-pane .switch-label-checked {\n      padding-right: 25px;\n      padding-left: 10px; }\n    .switch.switch-small > .switch-pane .switch-label-unchecked {\n      padding-left: 25px;\n      padding-right: 10px; }\n  .switch.switch-medium {\n    height: 30px;\n    border-radius: 30px; }\n    .switch.switch-medium small {\n      width: 30px;\n      height: 30px;\n      right: calc(100% - 30px); }\n    .switch.switch-medium > .switch-pane > span {\n      line-height: 30px; }\n    .switch.switch-medium > .switch-pane .switch-label-checked {\n      padding-right: 35px;\n      padding-left: 15px; }\n    .switch.switch-medium > .switch-pane .switch-label-unchecked {\n      padding-left: 35px;\n      padding-right: 15px; }\n  .switch.switch-large {\n    height: 40px;\n    border-radius: 40px; }\n    .switch.switch-large small {\n      width: 40px;\n      height: 40px;\n      right: calc(100% - 40px); }\n    .switch.switch-large > .switch-pane > span {\n      line-height: 40px; }\n    .switch.switch-large > .switch-pane .switch-label-checked {\n      padding-right: 45px;\n      padding-left: 20px; }\n    .switch.switch-large > .switch-pane .switch-label-unchecked {\n      padding-left: 45px;\n      padding-right: 20px; }\n  .switch.checked {\n    background: #64bd63; }\n    .switch.checked small {\n      right: 0;\n      left: auto; }\n    .switch.checked .switch-pane {\n      top: 0; }\n      .switch.checked .switch-pane .switch-label-checked {\n        display: block; }\n      .switch.checked .switch-pane .switch-label-unchecked {\n        display: none; }\n  .switch.disabled {\n    opacity: 0.5;\n    cursor: not-allowed; }\n  .switch .switch-pane {\n    display: flex;\n    flex-direction: column;\n    height: 100%;\n    min-height: 100%;\n    justify-content: flex-start;\n    align-items: center;\n    top: 0;\n    position: relative;\n    pointer-events: none; }\n    .switch .switch-pane > span {\n      display: block;\n      min-height: 100%; }\n    .switch .switch-pane .switch-label {\n      color: black; }\n      .switch .switch-pane .switch-label-checked {\n        display: none; }\n      .switch .switch-pane .switch-label-unchecked {\n        display: block; }\n  .switch.loading {\n    background-color: #f1f1f1; }\n    .switch.loading small {\n      background-color: transparent;\n      border: none;\n      box-shadow: none;\n      right: 50%;\n      transform: translateX(50%); }\n", ".switch.switch-small {\n  min-width: 33px; }\n\n.switch.switch-medium {\n  min-width: 50px; }\n\n.switch.switch-large {\n  min-width: 60px; }\n\n.switch.switch-small > .switch-pane > span {\n  font-size: 9px; }\n\n.switch.switch-medium > .switch-pane > span {\n  font-size: 16px; }\n\n.switch.switch-large > .switch-pane > span {\n  font-size: 16px; }\n\n.switch {\n  border: 1px solid #dfdfdf;\n  position: relative;\n  display: inline-block;\n  box-sizing: content-box;\n  padding: 0;\n  margin: 0;\n  cursor: pointer;\n  box-shadow: #dfdfdf 0 0 0 0 inset;\n  transition: 0.3s ease-out all;\n  -webkit-transition: 0.3s ease-out all;\n  white-space: nowrap; }\n\n.switch small {\n    border-radius: 100%;\n    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);\n    position: absolute;\n    top: 0;\n    right: calc(100% - 30px);\n    transition: 0.3s ease-out all;\n    -webkit-transition: 0.3s ease-out all;\n    background: #fff;\n    display: flex;\n    align-items: center;\n    justify-content: center; }\n\n.switch.switch-small {\n    height: 20px;\n    border-radius: 20px; }\n\n.switch.switch-small small {\n      width: 20px;\n      height: 20px;\n      right: calc(100% - 20px); }\n\n.switch.switch-small > .switch-pane > span {\n      line-height: 20px; }\n\n.switch.switch-small > .switch-pane .switch-label-checked {\n      padding-right: 25px;\n      padding-left: 10px; }\n\n.switch.switch-small > .switch-pane .switch-label-unchecked {\n      padding-left: 25px;\n      padding-right: 10px; }\n\n.switch.switch-medium {\n    height: 30px;\n    border-radius: 30px; }\n\n.switch.switch-medium small {\n      width: 30px;\n      height: 30px;\n      right: calc(100% - 30px); }\n\n.switch.switch-medium > .switch-pane > span {\n      line-height: 30px; }\n\n.switch.switch-medium > .switch-pane .switch-label-checked {\n      padding-right: 35px;\n      padding-left: 15px; }\n\n.switch.switch-medium > .switch-pane .switch-label-unchecked {\n      padding-left: 35px;\n      padding-right: 15px; }\n\n.switch.switch-large {\n    height: 40px;\n    border-radius: 40px; }\n\n.switch.switch-large small {\n      width: 40px;\n      height: 40px;\n      right: calc(100% - 40px); }\n\n.switch.switch-large > .switch-pane > span {\n      line-height: 40px; }\n\n.switch.switch-large > .switch-pane .switch-label-checked {\n      padding-right: 45px;\n      padding-left: 20px; }\n\n.switch.switch-large > .switch-pane .switch-label-unchecked {\n      padding-left: 45px;\n      padding-right: 20px; }\n\n.switch.checked {\n    background: #64bd63; }\n\n.switch.checked small {\n      right: 0;\n      left: auto; }\n\n.switch.checked .switch-pane {\n      top: 0; }\n\n.switch.checked .switch-pane .switch-label-checked {\n        display: block; }\n\n.switch.checked .switch-pane .switch-label-unchecked {\n        display: none; }\n\n.switch.disabled {\n    opacity: 0.5;\n    cursor: not-allowed; }\n\n.switch .switch-pane {\n    display: flex;\n    flex-direction: column;\n    height: 100%;\n    min-height: 100%;\n    justify-content: flex-start;\n    align-items: center;\n    top: 0;\n    position: relative;\n    pointer-events: none; }\n\n.switch .switch-pane > span {\n      display: block;\n      min-height: 100%; }\n\n.switch .switch-pane .switch-label {\n      color: black; }\n\n.switch .switch-pane .switch-label-checked {\n        display: none; }\n\n.switch .switch-pane .switch-label-unchecked {\n        display: block; }\n\n.switch.loading {\n    background-color: #f1f1f1; }\n\n.switch.loading small {\n      background-color: transparent;\n      border: none;\n      box-shadow: none;\n      right: 50%;\n      transform: translateX(50%); }\n\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9uZ3gtdWktc3dpdGNoL3VpLXN3aXRjaC5jb21wb25lbnQuY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0UsZUFBZSxFQUFFOztBQUVuQjtFQUNFLGVBQWUsRUFBRTs7QUFFbkI7RUFDRSxlQUFlLEVBQUU7O0FBRW5CO0VBQ0UsY0FBYyxFQUFFOztBQUVsQjtFQUNFLGVBQWUsRUFBRTs7QUFFbkI7RUFDRSxlQUFlLEVBQUU7O0FBRW5CO0VBQ0UseUJBQXlCO0VBQ3pCLGtCQUFrQjtFQUNsQixxQkFBcUI7RUFDckIsdUJBQXVCO0VBQ3ZCLFVBQVU7RUFDVixTQUFTO0VBQ1QsZUFBZTtFQUNmLGlDQUFpQztFQUNqQyw2QkFBNkI7RUFDN0IscUNBQXFDO0VBQ3JDLG1CQUFtQixFQUFFOztBQUNyQjtJQUNFLG1CQUFtQjtJQUNuQix3Q0FBd0M7SUFDeEMsa0JBQWtCO0lBQ2xCLE1BQU07SUFDTix3QkFBd0I7SUFDeEIsNkJBQTZCO0lBQzdCLHFDQUFxQztJQUNyQyxnQkFBZ0I7SUFDaEIsYUFBYTtJQUNiLG1CQUFtQjtJQUNuQix1QkFBdUIsRUFBRTs7QUFDM0I7SUFDRSxZQUFZO0lBQ1osbUJBQW1CLEVBQUU7O0FBQ3JCO01BQ0UsV0FBVztNQUNYLFlBQVk7TUFDWix3QkFBd0IsRUFBRTs7QUFDNUI7TUFDRSxpQkFBaUIsRUFBRTs7QUFDckI7TUFDRSxtQkFBbUI7TUFDbkIsa0JBQWtCLEVBQUU7O0FBQ3RCO01BQ0Usa0JBQWtCO01BQ2xCLG1CQUFtQixFQUFFOztBQUN6QjtJQUNFLFlBQVk7SUFDWixtQkFBbUIsRUFBRTs7QUFDckI7TUFDRSxXQUFXO01BQ1gsWUFBWTtNQUNaLHdCQUF3QixFQUFFOztBQUM1QjtNQUNFLGlCQUFpQixFQUFFOztBQUNyQjtNQUNFLG1CQUFtQjtNQUNuQixrQkFBa0IsRUFBRTs7QUFDdEI7TUFDRSxrQkFBa0I7TUFDbEIsbUJBQW1CLEVBQUU7O0FBQ3pCO0lBQ0UsWUFBWTtJQUNaLG1CQUFtQixFQUFFOztBQUNyQjtNQUNFLFdBQVc7TUFDWCxZQUFZO01BQ1osd0JBQXdCLEVBQUU7O0FBQzVCO01BQ0UsaUJBQWlCLEVBQUU7O0FBQ3JCO01BQ0UsbUJBQW1CO01BQ25CLGtCQUFrQixFQUFFOztBQUN0QjtNQUNFLGtCQUFrQjtNQUNsQixtQkFBbUIsRUFBRTs7QUFDekI7SUFDRSxtQkFBbUIsRUFBRTs7QUFDckI7TUFDRSxRQUFRO01BQ1IsVUFBVSxFQUFFOztBQUNkO01BQ0UsTUFBTSxFQUFFOztBQUNSO1FBQ0UsY0FBYyxFQUFFOztBQUNsQjtRQUNFLGFBQWEsRUFBRTs7QUFDckI7SUFDRSxZQUFZO0lBQ1osbUJBQW1CLEVBQUU7O0FBQ3ZCO0lBQ0UsYUFBYTtJQUNiLHNCQUFzQjtJQUN0QixZQUFZO0lBQ1osZ0JBQWdCO0lBQ2hCLDJCQUEyQjtJQUMzQixtQkFBbUI7SUFDbkIsTUFBTTtJQUNOLGtCQUFrQjtJQUNsQixvQkFBb0IsRUFBRTs7QUFDdEI7TUFDRSxjQUFjO01BQ2QsZ0JBQWdCLEVBQUU7O0FBQ3BCO01BQ0UsWUFBWSxFQUFFOztBQUNkO1FBQ0UsYUFBYSxFQUFFOztBQUNqQjtRQUNFLGNBQWMsRUFBRTs7QUFDdEI7SUFDRSx5QkFBeUIsRUFBRTs7QUFDM0I7TUFDRSw2QkFBNkI7TUFDN0IsWUFBWTtNQUNaLGdCQUFnQjtNQUNoQixVQUFVO01BQ1YsMEJBQTBCLEVBQUUiLCJmaWxlIjoibm9kZV9tb2R1bGVzL25neC11aS1zd2l0Y2gvdWktc3dpdGNoLmNvbXBvbmVudC5jc3MiLCJzb3VyY2VzQ29udGVudCI6WyIuc3dpdGNoLnN3aXRjaC1zbWFsbCB7XG4gIG1pbi13aWR0aDogMzNweDsgfVxuXG4uc3dpdGNoLnN3aXRjaC1tZWRpdW0ge1xuICBtaW4td2lkdGg6IDUwcHg7IH1cblxuLnN3aXRjaC5zd2l0Y2gtbGFyZ2Uge1xuICBtaW4td2lkdGg6IDYwcHg7IH1cblxuLnN3aXRjaC5zd2l0Y2gtc21hbGwgPiAuc3dpdGNoLXBhbmUgPiBzcGFuIHtcbiAgZm9udC1zaXplOiA5cHg7IH1cblxuLnN3aXRjaC5zd2l0Y2gtbWVkaXVtID4gLnN3aXRjaC1wYW5lID4gc3BhbiB7XG4gIGZvbnQtc2l6ZTogMTZweDsgfVxuXG4uc3dpdGNoLnN3aXRjaC1sYXJnZSA+IC5zd2l0Y2gtcGFuZSA+IHNwYW4ge1xuICBmb250LXNpemU6IDE2cHg7IH1cblxuLnN3aXRjaCB7XG4gIGJvcmRlcjogMXB4IHNvbGlkICNkZmRmZGY7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xuICBib3gtc2l6aW5nOiBjb250ZW50LWJveDtcbiAgcGFkZGluZzogMDtcbiAgbWFyZ2luOiAwO1xuICBjdXJzb3I6IHBvaW50ZXI7XG4gIGJveC1zaGFkb3c6ICNkZmRmZGYgMCAwIDAgMCBpbnNldDtcbiAgdHJhbnNpdGlvbjogMC4zcyBlYXNlLW91dCBhbGw7XG4gIC13ZWJraXQtdHJhbnNpdGlvbjogMC4zcyBlYXNlLW91dCBhbGw7XG4gIHdoaXRlLXNwYWNlOiBub3dyYXA7IH1cbiAgLnN3aXRjaCBzbWFsbCB7XG4gICAgYm9yZGVyLXJhZGl1czogMTAwJTtcbiAgICBib3gtc2hhZG93OiAwIDFweCAzcHggcmdiYSgwLCAwLCAwLCAwLjQpO1xuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICB0b3A6IDA7XG4gICAgcmlnaHQ6IGNhbGMoMTAwJSAtIDMwcHgpO1xuICAgIHRyYW5zaXRpb246IDAuM3MgZWFzZS1vdXQgYWxsO1xuICAgIC13ZWJraXQtdHJhbnNpdGlvbjogMC4zcyBlYXNlLW91dCBhbGw7XG4gICAgYmFja2dyb3VuZDogI2ZmZjtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7IH1cbiAgLnN3aXRjaC5zd2l0Y2gtc21hbGwge1xuICAgIGhlaWdodDogMjBweDtcbiAgICBib3JkZXItcmFkaXVzOiAyMHB4OyB9XG4gICAgLnN3aXRjaC5zd2l0Y2gtc21hbGwgc21hbGwge1xuICAgICAgd2lkdGg6IDIwcHg7XG4gICAgICBoZWlnaHQ6IDIwcHg7XG4gICAgICByaWdodDogY2FsYygxMDAlIC0gMjBweCk7IH1cbiAgICAuc3dpdGNoLnN3aXRjaC1zbWFsbCA+IC5zd2l0Y2gtcGFuZSA+IHNwYW4ge1xuICAgICAgbGluZS1oZWlnaHQ6IDIwcHg7IH1cbiAgICAuc3dpdGNoLnN3aXRjaC1zbWFsbCA+IC5zd2l0Y2gtcGFuZSAuc3dpdGNoLWxhYmVsLWNoZWNrZWQge1xuICAgICAgcGFkZGluZy1yaWdodDogMjVweDtcbiAgICAgIHBhZGRpbmctbGVmdDogMTBweDsgfVxuICAgIC5zd2l0Y2guc3dpdGNoLXNtYWxsID4gLnN3aXRjaC1wYW5lIC5zd2l0Y2gtbGFiZWwtdW5jaGVja2VkIHtcbiAgICAgIHBhZGRpbmctbGVmdDogMjVweDtcbiAgICAgIHBhZGRpbmctcmlnaHQ6IDEwcHg7IH1cbiAgLnN3aXRjaC5zd2l0Y2gtbWVkaXVtIHtcbiAgICBoZWlnaHQ6IDMwcHg7XG4gICAgYm9yZGVyLXJhZGl1czogMzBweDsgfVxuICAgIC5zd2l0Y2guc3dpdGNoLW1lZGl1bSBzbWFsbCB7XG4gICAgICB3aWR0aDogMzBweDtcbiAgICAgIGhlaWdodDogMzBweDtcbiAgICAgIHJpZ2h0OiBjYWxjKDEwMCUgLSAzMHB4KTsgfVxuICAgIC5zd2l0Y2guc3dpdGNoLW1lZGl1bSA+IC5zd2l0Y2gtcGFuZSA+IHNwYW4ge1xuICAgICAgbGluZS1oZWlnaHQ6IDMwcHg7IH1cbiAgICAuc3dpdGNoLnN3aXRjaC1tZWRpdW0gPiAuc3dpdGNoLXBhbmUgLnN3aXRjaC1sYWJlbC1jaGVja2VkIHtcbiAgICAgIHBhZGRpbmctcmlnaHQ6IDM1cHg7XG4gICAgICBwYWRkaW5nLWxlZnQ6IDE1cHg7IH1cbiAgICAuc3dpdGNoLnN3aXRjaC1tZWRpdW0gPiAuc3dpdGNoLXBhbmUgLnN3aXRjaC1sYWJlbC11bmNoZWNrZWQge1xuICAgICAgcGFkZGluZy1sZWZ0OiAzNXB4O1xuICAgICAgcGFkZGluZy1yaWdodDogMTVweDsgfVxuICAuc3dpdGNoLnN3aXRjaC1sYXJnZSB7XG4gICAgaGVpZ2h0OiA0MHB4O1xuICAgIGJvcmRlci1yYWRpdXM6IDQwcHg7IH1cbiAgICAuc3dpdGNoLnN3aXRjaC1sYXJnZSBzbWFsbCB7XG4gICAgICB3aWR0aDogNDBweDtcbiAgICAgIGhlaWdodDogNDBweDtcbiAgICAgIHJpZ2h0OiBjYWxjKDEwMCUgLSA0MHB4KTsgfVxuICAgIC5zd2l0Y2guc3dpdGNoLWxhcmdlID4gLnN3aXRjaC1wYW5lID4gc3BhbiB7XG4gICAgICBsaW5lLWhlaWdodDogNDBweDsgfVxuICAgIC5zd2l0Y2guc3dpdGNoLWxhcmdlID4gLnN3aXRjaC1wYW5lIC5zd2l0Y2gtbGFiZWwtY2hlY2tlZCB7XG4gICAgICBwYWRkaW5nLXJpZ2h0OiA0NXB4O1xuICAgICAgcGFkZGluZy1sZWZ0OiAyMHB4OyB9XG4gICAgLnN3aXRjaC5zd2l0Y2gtbGFyZ2UgPiAuc3dpdGNoLXBhbmUgLnN3aXRjaC1sYWJlbC11bmNoZWNrZWQge1xuICAgICAgcGFkZGluZy1sZWZ0OiA0NXB4O1xuICAgICAgcGFkZGluZy1yaWdodDogMjBweDsgfVxuICAuc3dpdGNoLmNoZWNrZWQge1xuICAgIGJhY2tncm91bmQ6ICM2NGJkNjM7IH1cbiAgICAuc3dpdGNoLmNoZWNrZWQgc21hbGwge1xuICAgICAgcmlnaHQ6IDA7XG4gICAgICBsZWZ0OiBhdXRvOyB9XG4gICAgLnN3aXRjaC5jaGVja2VkIC5zd2l0Y2gtcGFuZSB7XG4gICAgICB0b3A6IDA7IH1cbiAgICAgIC5zd2l0Y2guY2hlY2tlZCAuc3dpdGNoLXBhbmUgLnN3aXRjaC1sYWJlbC1jaGVja2VkIHtcbiAgICAgICAgZGlzcGxheTogYmxvY2s7IH1cbiAgICAgIC5zd2l0Y2guY2hlY2tlZCAuc3dpdGNoLXBhbmUgLnN3aXRjaC1sYWJlbC11bmNoZWNrZWQge1xuICAgICAgICBkaXNwbGF5OiBub25lOyB9XG4gIC5zd2l0Y2guZGlzYWJsZWQge1xuICAgIG9wYWNpdHk6IDAuNTtcbiAgICBjdXJzb3I6IG5vdC1hbGxvd2VkOyB9XG4gIC5zd2l0Y2ggLnN3aXRjaC1wYW5lIHtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAgaGVpZ2h0OiAxMDAlO1xuICAgIG1pbi1oZWlnaHQ6IDEwMCU7XG4gICAganVzdGlmeS1jb250ZW50OiBmbGV4LXN0YXJ0O1xuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgdG9wOiAwO1xuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgICBwb2ludGVyLWV2ZW50czogbm9uZTsgfVxuICAgIC5zd2l0Y2ggLnN3aXRjaC1wYW5lID4gc3BhbiB7XG4gICAgICBkaXNwbGF5OiBibG9jaztcbiAgICAgIG1pbi1oZWlnaHQ6IDEwMCU7IH1cbiAgICAuc3dpdGNoIC5zd2l0Y2gtcGFuZSAuc3dpdGNoLWxhYmVsIHtcbiAgICAgIGNvbG9yOiBibGFjazsgfVxuICAgICAgLnN3aXRjaCAuc3dpdGNoLXBhbmUgLnN3aXRjaC1sYWJlbC1jaGVja2VkIHtcbiAgICAgICAgZGlzcGxheTogbm9uZTsgfVxuICAgICAgLnN3aXRjaCAuc3dpdGNoLXBhbmUgLnN3aXRjaC1sYWJlbC11bmNoZWNrZWQge1xuICAgICAgICBkaXNwbGF5OiBibG9jazsgfVxuICAuc3dpdGNoLmxvYWRpbmcge1xuICAgIGJhY2tncm91bmQtY29sb3I6ICNmMWYxZjE7IH1cbiAgICAuc3dpdGNoLmxvYWRpbmcgc21hbGwge1xuICAgICAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7XG4gICAgICBib3JkZXI6IG5vbmU7XG4gICAgICBib3gtc2hhZG93OiBub25lO1xuICAgICAgcmlnaHQ6IDUwJTtcbiAgICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWCg1MCUpOyB9XG4iXX0= */"]
      }]); // Exports

      module.exports = exports;
      /***/
    },

    /***/
    "./node_modules/css-loader/dist/cjs.js?!./node_modules/postcss-loader/src/index.js?!./src/styles.css":
    /*!*********************************************************************************************************************!*\
      !*** ./node_modules/css-loader/dist/cjs.js??ref--13-1!./node_modules/postcss-loader/src??embedded!./src/styles.css ***!
      \*********************************************************************************************************************/

    /*! no static exports found */

    /***/
    function node_modulesCssLoaderDistCjsJsNode_modulesPostcssLoaderSrcIndexJsSrcStylesCss(module, exports, __webpack_require__) {
      // Imports
      var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(
      /*! ../node_modules/css-loader/dist/runtime/api.js */
      "./node_modules/css-loader/dist/runtime/api.js");

      exports = ___CSS_LOADER_API_IMPORT___(true); // Module

      exports.push([module.i, "/* You can add global styles to this file, and also import other style files */\n@tailwind base;\n@tailwind components;\n@tailwind utilities;\nhtml {\n  font-family: \"Montserrat\", sans-serif;\n}\n::-webkit-scrollbar-track {\n  /* -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3); */\n  background-color: transparent;\n}\n::-webkit-scrollbar {\n  width: 10px;\n  background-color: transparent;\n  border-radius: 5px;\n  margin-top: 10px;\n}\n::-webkit-scrollbar-thumb {\n  margin-top: 10px;\n  background-color: transparent;\n  border-radius: 5px;\n}\n\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zdHlsZXMuY3NzIiwibm9kZV9tb2R1bGVzL3RhaWx3aW5kY3NzL2Jhc2UuY3NzIiwibm9kZV9tb2R1bGVzL3RhaWx3aW5kY3NzL2NvbXBvbmVudHMuY3NzIiwibm9kZV9tb2R1bGVzL3RhaWx3aW5kY3NzL3V0aWxpdGllcy5jc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsOEVBQThFO0FDQTlFLGNBQWM7QUNBZCxvQkFBb0I7QUNBcEIsbUJBQW1CO0FIS25CO0VBQ0UscUNBQXFDO0FBQ3ZDO0FBSUE7RUFDRSx1REFBdUQ7RUFDdkQsNkJBQTZCO0FBQy9CO0FBRUE7RUFDRSxXQUFXO0VBQ1gsNkJBQTZCO0VBQzdCLGtCQUFrQjtFQUNsQixnQkFBZ0I7QUFDbEI7QUFFQTtFQUNFLGdCQUFnQjtFQUNoQiw2QkFBNkI7RUFDN0Isa0JBQWtCO0FBQ3BCIiwiZmlsZSI6InNyYy9zdHlsZXMuY3NzIiwic291cmNlc0NvbnRlbnQiOlsiLyogWW91IGNhbiBhZGQgZ2xvYmFsIHN0eWxlcyB0byB0aGlzIGZpbGUsIGFuZCBhbHNvIGltcG9ydCBvdGhlciBzdHlsZSBmaWxlcyAqL1xuQGltcG9ydCBcInRhaWx3aW5kY3NzL2Jhc2VcIjtcbkBpbXBvcnQgXCJ0YWlsd2luZGNzcy9jb21wb25lbnRzXCI7XG5AaW1wb3J0IFwidGFpbHdpbmRjc3MvdXRpbGl0aWVzXCI7XG5cbmh0bWwge1xuICBmb250LWZhbWlseTogXCJNb250c2VycmF0XCIsIHNhbnMtc2VyaWY7XG59XG5cbkBpbXBvcnQgXCJ+Ym9vdHN0cmFwL2Rpc3QvY3NzL2Jvb3RzdHJhcC5taW4uY3NzXCI7XG5cbjo6LXdlYmtpdC1zY3JvbGxiYXItdHJhY2sge1xuICAvKiAtd2Via2l0LWJveC1zaGFkb3c6IGluc2V0IDAgMCA2cHggcmdiYSgwLDAsMCwwLjMpOyAqL1xuICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcbn1cblxuOjotd2Via2l0LXNjcm9sbGJhciB7XG4gIHdpZHRoOiAxMHB4O1xuICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcbiAgYm9yZGVyLXJhZGl1czogNXB4O1xuICBtYXJnaW4tdG9wOiAxMHB4O1xufVxuXG46Oi13ZWJraXQtc2Nyb2xsYmFyLXRodW1iIHtcbiAgbWFyZ2luLXRvcDogMTBweDtcbiAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7XG4gIGJvcmRlci1yYWRpdXM6IDVweDtcbn1cbiIsIkB0YWlsd2luZCBiYXNlO1xuIiwiQHRhaWx3aW5kIGNvbXBvbmVudHM7XG4iLCJAdGFpbHdpbmQgdXRpbGl0aWVzO1xuIl19 */", "", {
        "version": 3,
        "sources": ["src/styles.css", "node_modules/tailwindcss/base.css", "node_modules/tailwindcss/components.css", "node_modules/tailwindcss/utilities.css", "styles.css"],
        "names": [],
        "mappings": "AAAA,8EAA8E;ACA9E,cAAc;ACAd,oBAAoB;ACApB,mBAAmB;AHKnB;EACE,qCAAqC;AACvC;AAIA;EACE,uDAAuD;EACvD,6BAA6B;AAC/B;AAEA;EACE,WAAW;EACX,6BAA6B;EAC7B,kBAAkB;EAClB,gBAAgB;AAClB;AAEA;EACE,gBAAgB;EAChB,6BAA6B;EAC7B,kBAAkB;AACpB;;AIJA,olDAAolD",
        "file": "styles.css",
        "sourcesContent": ["/* You can add global styles to this file, and also import other style files */\n@import \"tailwindcss/base\";\n@import \"tailwindcss/components\";\n@import \"tailwindcss/utilities\";\n\nhtml {\n  font-family: \"Montserrat\", sans-serif;\n}\n\n@import \"~bootstrap/dist/css/bootstrap.min.css\";\n\n::-webkit-scrollbar-track {\n  /* -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3); */\n  background-color: transparent;\n}\n\n::-webkit-scrollbar {\n  width: 10px;\n  background-color: transparent;\n  border-radius: 5px;\n  margin-top: 10px;\n}\n\n::-webkit-scrollbar-thumb {\n  margin-top: 10px;\n  background-color: transparent;\n  border-radius: 5px;\n}\n", "@tailwind base;\n", "@tailwind components;\n", "@tailwind utilities;\n", "/* You can add global styles to this file, and also import other style files */\n@tailwind base;\n@tailwind components;\n@tailwind utilities;\nhtml {\n  font-family: \"Montserrat\", sans-serif;\n}\n::-webkit-scrollbar-track {\n  /* -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3); */\n  background-color: transparent;\n}\n::-webkit-scrollbar {\n  width: 10px;\n  background-color: transparent;\n  border-radius: 5px;\n  margin-top: 10px;\n}\n::-webkit-scrollbar-thumb {\n  margin-top: 10px;\n  background-color: transparent;\n  border-radius: 5px;\n}\n\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zdHlsZXMuY3NzIiwibm9kZV9tb2R1bGVzL3RhaWx3aW5kY3NzL2Jhc2UuY3NzIiwibm9kZV9tb2R1bGVzL3RhaWx3aW5kY3NzL2NvbXBvbmVudHMuY3NzIiwibm9kZV9tb2R1bGVzL3RhaWx3aW5kY3NzL3V0aWxpdGllcy5jc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsOEVBQThFO0FDQTlFLGNBQWM7QUNBZCxvQkFBb0I7QUNBcEIsbUJBQW1CO0FIS25CO0VBQ0UscUNBQXFDO0FBQ3ZDO0FBSUE7RUFDRSx1REFBdUQ7RUFDdkQsNkJBQTZCO0FBQy9CO0FBRUE7RUFDRSxXQUFXO0VBQ1gsNkJBQTZCO0VBQzdCLGtCQUFrQjtFQUNsQixnQkFBZ0I7QUFDbEI7QUFFQTtFQUNFLGdCQUFnQjtFQUNoQiw2QkFBNkI7RUFDN0Isa0JBQWtCO0FBQ3BCIiwiZmlsZSI6InNyYy9zdHlsZXMuY3NzIiwic291cmNlc0NvbnRlbnQiOlsiLyogWW91IGNhbiBhZGQgZ2xvYmFsIHN0eWxlcyB0byB0aGlzIGZpbGUsIGFuZCBhbHNvIGltcG9ydCBvdGhlciBzdHlsZSBmaWxlcyAqL1xuQGltcG9ydCBcInRhaWx3aW5kY3NzL2Jhc2VcIjtcbkBpbXBvcnQgXCJ0YWlsd2luZGNzcy9jb21wb25lbnRzXCI7XG5AaW1wb3J0IFwidGFpbHdpbmRjc3MvdXRpbGl0aWVzXCI7XG5cbmh0bWwge1xuICBmb250LWZhbWlseTogXCJNb250c2VycmF0XCIsIHNhbnMtc2VyaWY7XG59XG5cbkBpbXBvcnQgXCJ+Ym9vdHN0cmFwL2Rpc3QvY3NzL2Jvb3RzdHJhcC5taW4uY3NzXCI7XG5cbjo6LXdlYmtpdC1zY3JvbGxiYXItdHJhY2sge1xuICAvKiAtd2Via2l0LWJveC1zaGFkb3c6IGluc2V0IDAgMCA2cHggcmdiYSgwLDAsMCwwLjMpOyAqL1xuICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcbn1cblxuOjotd2Via2l0LXNjcm9sbGJhciB7XG4gIHdpZHRoOiAxMHB4O1xuICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcbiAgYm9yZGVyLXJhZGl1czogNXB4O1xuICBtYXJnaW4tdG9wOiAxMHB4O1xufVxuXG46Oi13ZWJraXQtc2Nyb2xsYmFyLXRodW1iIHtcbiAgbWFyZ2luLXRvcDogMTBweDtcbiAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7XG4gIGJvcmRlci1yYWRpdXM6IDVweDtcbn1cbiIsIkB0YWlsd2luZCBiYXNlO1xuIiwiQHRhaWx3aW5kIGNvbXBvbmVudHM7XG4iLCJAdGFpbHdpbmQgdXRpbGl0aWVzO1xuIl19 */"]
      }]); // Exports

      module.exports = exports;
      /***/
    },

    /***/
    "./node_modules/css-loader/dist/runtime/api.js":
    /*!*****************************************************!*\
      !*** ./node_modules/css-loader/dist/runtime/api.js ***!
      \*****************************************************/

    /*! no static exports found */

    /***/
    function node_modulesCssLoaderDistRuntimeApiJs(module, exports, __webpack_require__) {
      "use strict";
      /*
        MIT License http://www.opensource.org/licenses/mit-license.php
        Author Tobias Koppers @sokra
      */
      // css base code, injected by the css-loader
      // eslint-disable-next-line func-names

      module.exports = function (useSourceMap) {
        var list = []; // return the list of modules as css string

        list.toString = function toString() {
          return this.map(function (item) {
            var content = cssWithMappingToString(item, useSourceMap);

            if (item[2]) {
              return "@media ".concat(item[2], " {").concat(content, "}");
            }

            return content;
          }).join('');
        }; // import a list of modules into the list
        // eslint-disable-next-line func-names


        list.i = function (modules, mediaQuery, dedupe) {
          if (typeof modules === 'string') {
            // eslint-disable-next-line no-param-reassign
            modules = [[null, modules, '']];
          }

          var alreadyImportedModules = {};

          if (dedupe) {
            for (var i = 0; i < this.length; i++) {
              // eslint-disable-next-line prefer-destructuring
              var id = this[i][0];

              if (id != null) {
                alreadyImportedModules[id] = true;
              }
            }
          }

          for (var _i = 0; _i < modules.length; _i++) {
            var item = [].concat(modules[_i]);

            if (dedupe && alreadyImportedModules[item[0]]) {
              // eslint-disable-next-line no-continue
              continue;
            }

            if (mediaQuery) {
              if (!item[2]) {
                item[2] = mediaQuery;
              } else {
                item[2] = "".concat(mediaQuery, " and ").concat(item[2]);
              }
            }

            list.push(item);
          }
        };

        return list;
      };

      function cssWithMappingToString(item, useSourceMap) {
        var content = item[1] || ''; // eslint-disable-next-line prefer-destructuring

        var cssMapping = item[3];

        if (!cssMapping) {
          return content;
        }

        if (useSourceMap && typeof btoa === 'function') {
          var sourceMapping = toComment(cssMapping);
          var sourceURLs = cssMapping.sources.map(function (source) {
            return "/*# sourceURL=".concat(cssMapping.sourceRoot || '').concat(source, " */");
          });
          return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
        }

        return [content].join('\n');
      } // Adapted from convert-source-map (MIT)


      function toComment(sourceMap) {
        // eslint-disable-next-line no-undef
        var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
        var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
        return "/*# ".concat(data, " */");
      }
      /***/

    },

    /***/
    "./node_modules/ngx-ui-switch/ui-switch.component.css":
    /*!************************************************************!*\
      !*** ./node_modules/ngx-ui-switch/ui-switch.component.css ***!
      \************************************************************/

    /*! no static exports found */

    /***/
    function node_modulesNgxUiSwitchUiSwitchComponentCss(module, exports, __webpack_require__) {
      var api = __webpack_require__(
      /*! ../@angular-builders/custom-webpack/node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */
      "./node_modules/@angular-builders/custom-webpack/node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");

      var content = __webpack_require__(
      /*! !../css-loader/dist/cjs.js??ref--13-1!../postcss-loader/src??embedded!./ui-switch.component.css */
      "./node_modules/css-loader/dist/cjs.js?!./node_modules/postcss-loader/src/index.js?!./node_modules/ngx-ui-switch/ui-switch.component.css");

      content = content.__esModule ? content["default"] : content;

      if (typeof content === 'string') {
        content = [[module.i, content, '']];
      }

      var options = {};
      options.insert = "head";
      options.singleton = false;
      var update = api(content, options);
      module.exports = content.locals || {};
      /***/
    },

    /***/
    "./src/styles.css":
    /*!************************!*\
      !*** ./src/styles.css ***!
      \************************/

    /*! no static exports found */

    /***/
    function srcStylesCss(module, exports, __webpack_require__) {
      var api = __webpack_require__(
      /*! ../node_modules/@angular-builders/custom-webpack/node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */
      "./node_modules/@angular-builders/custom-webpack/node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");

      var content = __webpack_require__(
      /*! !../node_modules/css-loader/dist/cjs.js??ref--13-1!../node_modules/postcss-loader/src??embedded!./styles.css */
      "./node_modules/css-loader/dist/cjs.js?!./node_modules/postcss-loader/src/index.js?!./src/styles.css");

      content = content.__esModule ? content["default"] : content;

      if (typeof content === 'string') {
        content = [[module.i, content, '']];
      }

      var options = {};
      options.insert = "head";
      options.singleton = false;
      var update = api(content, options);
      module.exports = content.locals || {};
      /***/
    },

    /***/
    3:
    /*!***********************************************************************************!*\
      !*** multi ./src/styles.css ./node_modules/ngx-ui-switch/ui-switch.component.css ***!
      \***********************************************************************************/

    /*! no static exports found */

    /***/
    function _(module, exports, __webpack_require__) {
      __webpack_require__(
      /*! C:\Users\Nome\Douglas\bromatoApp\bromatology\src\styles.css */
      "./src/styles.css");

      module.exports = __webpack_require__(
      /*! C:\Users\Nome\Douglas\bromatoApp\bromatology\node_modules\ngx-ui-switch\ui-switch.component.css */
      "./node_modules/ngx-ui-switch/ui-switch.component.css");
      /***/
    }
  }, [[3, "runtime"]]]);
})();
//# sourceMappingURL=styles-es5.js.map