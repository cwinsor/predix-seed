(function(){
  // Instanciate window.predix object/namespace if
  window.predix = window.predix || {};

  // Define window-level function that checks if string value
  // is the name of a defined custom element
  window.predix.isRegistered = function(elementName) {
    switch(document.createElement(elementName).constructor) {
      case HTMLElement: return false;
      case HTMLUnknownElement: return undefined;
    }
    return true;
  }

  // Define window-level utility function for fetching the URL parameter
  function getURLParameter(theParameter) {
    var params = window.location.search.substr(1).split('&');

    for (var i = 0; i < params.length; i++) {
      var p=params[i].split('=');
      if (p[0] == theParameter) {
        return decodeURIComponent(p[1]);
      }
    }
    return false;
  }

  // If URL flag for developer coaching is found,
  // then create and show path guide (attach to <body> element)
  var coaching = getURLParameter('coach');

  function onMainElementLoaded() {
    // Polymer.importHref(['/elements/dev-coach/dev-coach.html'], function(){});
    var link = document.createElement('link');
    link.setAttribute('rel', 'import');
    link.setAttribute('href', '/elements/dev-guide/dev-guide-imports.html');
    link.onload = setTimeout(onCoachingLoaded, 2000);
    document.head.appendChild(link);
  }

  function tourFeature(event) {
    var tourID = event.payload.id;
    if (window.predix.isTouring) {
      window.predix.hopscotch.endTour(false);
      window.predix.isTouring = false;
    }
    window.predix.hopscotch.startTour(window.predix.hopscotchTour['tour' + tourID]);
    window.predix.isTouring = true;
  }

  function onCoachingLoaded() {
    // if "px-path-guide" was registered
    if ( window.predix.isRegistered && window.predix.isRegistered('px-path-guide')) {
      // create a px-path-guide custom element,
      // configure it and attach it to the <body> element
      var pathGuideEl = document.createElement('px-path-guide');

      var configProps = ['id', 'completedStepIcon', 'currentStepIcon', 'stepClickEventName'];

      pathGuideEl.id = "path-guide";
      pathGuideEl.completedStepIcon = "fa-diamond";
      pathGuideEl.currentStepIcon = "fa-circle";
      pathGuideEl.stepClickEventName = window.predix.featureTourEventName;

      for (var i=0; i < configProps.length; i++) {
        pathGuideEl[configProps[i]] = window.predix.pathGuideConfig[configProps[i]] || pathGuideEl[configProps[i]];
      }

      pathGuideEl.steps = [
          { id: 1, label: "Basic App", started: true, completed: true, current: false},
          { id: 2, label: "UAA", started: true, completed: true, current: false},
          { id: 3, label: "Asset Data", started: false, completed: false, current: true},
          { id: 4, label: "Analytics", started: false, completed: false, current: false}
        ];

      /* Default Styles */

      pathGuideEl.style.position = 'absolute';
      var width = pathGuideEl.clientWidth;
      var halfWidth = width / 2;
      pathGuideEl.style.left = "50%";
      pathGuideEl.style.marginLeft = "-" + halfWidth + "px";
      pathGuideEl.style.marginLeft = "-450px"; // <-------- temporary code
      pathGuideEl.style.top = '13px';

      pathGuideEl.customStyle['--px-path-guide-icon-size'] = '16px';
      pathGuideEl.customStyle['--px-path-guide-icon-color'] = '#3ab4d4';
      pathGuideEl.customStyle['--px-path-guide-icon-top'] = '-8px';
      pathGuideEl.customStyle['--px-path-guide-icon-left'] = '-8px';
      pathGuideEl.customStyle['--px-path-guide-current-icon-size'] = '20px';
      pathGuideEl.customStyle['--px-path-guide-current-icon-color'] = '#3ab4d4';
      pathGuideEl.customStyle['--px-path-guide-current-icon-top'] = '-10px';
      pathGuideEl.customStyle['--px-path-guide-current-icon-left'] = '-9px';

      pathGuideEl.customStyle['--px-path-guide-connector-color'] = '#3ab4d4';
      pathGuideEl.customStyle['--px-path-guide-connector-length'] = '150px';

      pathGuideEl.customStyle['--px-path-guide-step-diameter'] = '24px';
      pathGuideEl.customStyle['--px-path-guide-step-radius'] = '12px';
      pathGuideEl.customStyle['--px-path-guide-step-border-color'] = '#3ab4d4';
      pathGuideEl.customStyle['--px-path-guide-step-fill-color'] = '#2c404c';
      pathGuideEl.customStyle['--px-path-guide-current-step-diameter'] = '30px';
      pathGuideEl.customStyle['--px-path-guide-current-step-radius'] = '15px';
      pathGuideEl.customStyle['--px-path-guide-current-step-border-color'] = '#fff';
      pathGuideEl.customStyle['--px-path-guide-current-step-fill-color'] = '#2c404c';

      pathGuideEl.customStyle['--px-path-guide-step-label-color'] = '#999';
      pathGuideEl.customStyle['--px-path-guide-step-label-font-weight'] = 'normal';
      pathGuideEl.customStyle['--px-path-guide-current-step-label-color'] = '#fff';
      pathGuideEl.customStyle['--px-path-guide-current-step-label-font-weight'] = 'bold';
      pathGuideEl.customStyle['--px-path-guide-step-label-width'] = '80px';
      pathGuideEl.customStyle['--px-path-guide-step-label-top'] = '18px';
      pathGuideEl.customStyle['--px-path-guide-step-label-font-size'] = '11px';
      /* End Default Styles */

      /* Any Custom Styles specified in window.predix.pathGuideConfig */
      var styles = window.predix.pathGuideConfig.styles;
      for (var style in styles) {
        if( styles.hasOwnProperty(style) && style !== 'vars') {
          pathGuideEl.style[style] = styles[style];
        }
      }

      var styleVars = window.predix.pathGuideConfig.styles.vars;
      for (var styleVar in styleVars) {
        if( styleVars.hasOwnProperty(styleVar) ) {
          pathGuideEl.customStyle['--' + styleVar] = styleVars[styleVar];
        }
      }

      pathGuideEl.updateStyles();

      window.predix.pathGuideElement = pathGuideEl;
      document.body.appendChild(pathGuideEl);

      window.addEventListener(window.predix.featureTourEventName, tourFeature);
    }
  }

  if (coaching === 'true') {
    var mainElement = document.querySelector('#main-element-import');
    if (mainElement.import && mainElement.import.readyState === 'complete') {
      onMainElementLoaded();
    } else {
      mainElement.addEventListener('load', onMainElementLoaded);
    }
  }
}());
