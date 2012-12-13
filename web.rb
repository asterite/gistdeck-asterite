require 'sinatra'
require 'rest-client'

JS = "
  GISTDECK_CSS_URL = '/gistdeck.css';

  function addListener(obj, eventName, listener) {
    if(obj.addEventListener) {
      obj.addEventListener(eventName, listener, false);
    } else {
    }
  }

  addListener(document, 'DOMContentLoaded', function() {
    var s = document.createElement('script');
    s.setAttribute('src','/gistdeck.js');
    document.getElementsByTagName('head')[0].appendChild(s);
  });
"
SCRIPT = %Q(<script type="text/javascript">#{JS}</script>)

get '/:gist_id' do |gist_id|
  html = RestClient.get "https://asteritedummy:asteritedummy1@gist.github.com/#{gist_id}"
  gist_content = html =~ /(<article\s+class=\"markdown-body\">.+\<\/article\>)/m && $1
  # index = body.index '</body>'

  "<html><head><script src=\"//ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js\"></script></head><body>#{gist_content}#{SCRIPT}</body></html>"
end