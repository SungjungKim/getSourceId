var session = ['screen', 'window'];

chrome.runtime.onConnect.addListener(function (port) {

  port.onMessage.addListener(function (message) {
    if (message && message.method == 'getSourceId') {
      getSourceId(message.payload.requestId);
    }
  });

  function getSourceId(requestId) {

    var tab = port.sender.tab;
    tab.url = port.sender.url;

    chrome.desktopCapture.chooseDesktopMedia(session, tab, function(sourceId) {

      console.log('sourceId', sourceId);

      // sourceId
      if (!sourceId || !sourceId.length) {
        return port.postMessage({
          method: 'permissionDenied',
          payload: {
            requestId: requestId
          }
        });
      }

      port.postMessage({
        method: 'sourceId',
        payload: {
          requestId: requestId,
          sourceId: sourceId
        }
      });
    });
  }
});
