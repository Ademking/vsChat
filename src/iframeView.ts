export default function getWebviewContent(username: string, chatroomId: string) {
  const vschatThemeUrl =
    "https://gistcdn.rawgit.org/Ademking/ea98a057a7de5f55e7c444d6a431b1f0/0d98302b41ff7960c6ef0a08d069202ecfd88997/theme.css";
  return `
  <!DOCTYPE html>
<html>
   <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>vsChat</title>
      <style>
         body,
         html, #app {
         width: 100%;
         height: 100%;
         overflow: hidden;
         }
         * {
         padding: 0;
         margin: 0;
         }
         iframe {
         width: 100%;
         height: 100%;
         overflow: hidden;
         border: none;
         }
         /* Snow effect */
         #snow {
         position: fixed;
         top: 0;
         left: 0;
         right: 0;
         bottom: 0;
         pointer-events: none;
         z-index: 1000;
         }
         
         #loader {
          position: absolute;
          left: 50%;
          top: 50%;
          z-index: 1;
          width: 60px;
          height: 60px;
          margin: -53px 0 0 -33px;
          border: 8px solid #f3f3f3;
          border-radius: 50%;
          border-top: 8px solid #3498db;
          -webkit-animation: spin 1s linear infinite;
          animation: spin 1s linear infinite;
          opacity: 0.8;
        }

        @-webkit-keyframes spin {
          0% { -webkit-transform: rotate(0deg); }
          100% { -webkit-transform: rotate(360deg); }
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      </style>
   </head>
   <body onload="loading()">

      <div id="loader"></div>

      <div id="app" style="display:none;">
        <div id="snow"></div>
        <iframe allowtransparency="true" src="https://embed.tlk.io/${chatroomId}?theme=theme--night&nickname=${username}&custom_css_path=${vschatThemeUrl}"
          frameborder="0"></iframe>
      </div>

      <script>
         // Loading screen
         var loadingScreen;

        function loading() {
          loadingScreen = setTimeout(showPage, 1000);
        }

        function showPage() {
          document.getElementById("loader").style.display = "none";
          document.getElementById("app").style.display = "block";
             
             // Snow effect - trigger resize event to show snow
             window.dispatchEvent(new Event('resize'));
        }

         // Snow Effect
         document.addEventListener('DOMContentLoaded', function(){
         var script = document.createElement('script');
         script.src = 'https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js';
         script.onload = function(){
             particlesJS("snow", {
                 "particles": {
                     "number": {
                         "value": 50,
                         "density": {
                             "enable": true,
                             "value_area": 800
                         }
                     },
                     "color": {
                         "value": "#ffffff"
                     },
                     "opacity": {
                         "value": 0.4,
                         "random": false,
                         "anim": {
                             "enable": false
                         }
                     },
                     "size": {
                         "value": 5,
                         "random": true,
                         "anim": {
                             "enable": false
                         }
                     },
                     "line_linked": {
                         "enable": false
                     },
                     "move": {
                         "enable": true,
                         "speed": 3,
                         "direction": "bottom",
                         "random": true,
                         "straight": false,
                         "out_mode": "out",
                         "bounce": false,
                         "attract": {
                             "enable": true,
                             "rotateX": 300,
                             "rotateY": 1200
                         }
                     }
                 },
                 "interactivity": {
                     "events": {
                         "onhover": {
                             "enable": false
                         },
                         "onclick": {
                             "enable": false
                         },
                         "resize": true
                     }
                 },
                 "retina_detect": true
             });
         }
         document.head.append(script);
         
         });
      
      </script>
   </body>
</html>
	`;
}
