require 'sinatra'
require 'rest-client'

JS = "
  GISTDECK_CSS_URL = '/gistdeck.css';

  function addListener(obj, eventName, listener) {
    if(obj.addEventListener) {
      obj.addEventListener(eventName, listener, false);
    } else {
      obj.attachEvent('on' + eventName, listener);
    }
  }

  addListener(document, 'DOMContentLoaded', function() {
    var s = document.createElement('script');
    s.setAttribute('src','https://raw.github.com/asterite/gistdeck/master/gistdeck.js');
    document.getElementsByTagName('head')[0].appendChild(s);
  });
"
SCRIPT = %Q(<script type="text/javascript">#{JS}</script>)

get '/:gist_id' do |gist_id|
  body = RestClient.get "https://gist.github.com/#{gist_id}"
  index = body.index '</body>'

  body[0 ... index] + SCRIPT + body[index .. -1]
end