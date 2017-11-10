'use strict';

/**
 * @ngdoc directive
 * @name gatoradeApp.directive:gamebox
 * @description
 * # gamebox
 */
angular.module('brainappbackendApp')
  .directive('gamebox', function () {
    return {
      template: '<iframe id="maingameframe" width="100%" height="100%" scrolling="no" frameborder="0" src="{{game.url}}"></iframe>',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {

          var myIframe = element.find("iframe")[0]
          var script = myIframe.contentWindow.document.createElement("script");
          script.type = "text/javascript";
          script.src = "../iframeResizer.contentWindow.min.js";
          <!-- iframe resizer-->

          myIframe.onload = function(){
              myIframe.contentWindow.document.body.appendChild(script);
              jQuery(document).ready(function () {

                  jQuery('#maingameframe').iFrameResize( [{
                      log:true,
                      //enablePublicMethods     : true,
                      heightCalculationMethod:'bodyScroll',

                      checkOrigin: true
                  }] );
              });
          }
      }
    };
  });


