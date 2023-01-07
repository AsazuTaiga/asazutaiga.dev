import Document, { Html, Head, Main, NextScript } from 'next/document'
import { GA_TRACKING_ID } from '../utils/gtag'

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          {GA_TRACKING_ID && (
            <>
              <script
                async
                src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
              ></script>
              <script
                dangerouslySetInnerHTML={{
                  __html: `window.dataLayer = window.dataLayer || [];
                          function gtag(){dataLayer.push(arguments);}
                          gtag('js', new Date());

                          gtag('config', '${GA_TRACKING_ID}');`,
                }}
              ></script>
            </>
          )}
          <script
            dangerouslySetInnerHTML={{
              __html: `window.twttr = (function(d, s, id) {
                    var js, fjs = d.getElementsByTagName(s)[0],
                      t = window.twttr || {};
                    if (d.getElementById(id)) return t;
                    js = d.createElement(s);
                    js.id = id;
                    js.src = "https://platform.twitter.com/widgets.js";
                    fjs.parentNode.insertBefore(js, fjs);
                  
                    t._e = [];
                    t.ready = function(f) {
                      t._e.push(f);
                    };
                  
                    return t;
                  }(document, "script", "twitter-wjs"));`,
            }}
          ></script>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
