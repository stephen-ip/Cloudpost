const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
  "Access-Control-Max-Age": "86400",
}

function handleOptions(request) {
  // Make sure the necessary headers are present
  // for this to be a valid pre-flight request
  let headers = request.headers;
  if (
    headers.get("Origin") !== null &&
    headers.get("Access-Control-Request-Method") !== null &&
    headers.get("Access-Control-Request-Headers") !== null
  ){
    // Handle CORS pre-flight request.
    // If you want to check or reject the requested method + headers
    // you can do that here.
    let respHeaders = {
      ...corsHeaders,
    // Allow all future content Request headers to go back to browser
    // such as Authorization (Bearer) or X-Client-Name-Version
      "Access-Control-Allow-Headers": request.headers.get("Access-Control-Request-Headers"),
    }

    return new Response(null, {
      headers: respHeaders,
    })
  }
  else {
    // Handle standard OPTIONS request.
    // If you want to allow other HTTP Methods, you can do that here.
    return new Response(null, {
      headers: {
        Allow: "GET, HEAD, POST, OPTIONS",
      },
    })
  }
}

addEventListener('fetch', event => {
  const request = event.request
  if (request.method === "OPTIONS") {
    // Handle CORS preflight requests
    event.respondWith(handleOptions(request))
  } else {
      event.respondWith(handleRequest(event.request))
  }
})

async function handleRequest(request) {
  if (request.url == "https://my-worker.stephenip.workers.dev/posts") {
    if (request.method === "GET") {
      let value = await MY_KV.list()
      var array_values = []
      for (let i=0; i<value.keys.length; i++) {
        const key = value.keys[i].name.toString()
        let val = await MY_KV.get(key)
        array_values.push(JSON.parse(val))
      }
      const headers = {
        'Access-Control-Allow-Origin': '*',
        'Content-type': 'application/json'
      }
      return new Response(JSON.stringify(array_values), { headers })
    } 
    else if (request.method === "POST") {
      function getDate() {
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, "0");
        var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
        var yyyy = today.getFullYear();
        today = mm + "/" + dd + "/" + yyyy;
        return today;
      }
      
      function formatAMPM(date) {
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? "pm" : "am";
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? "0" + minutes : minutes;
        var strTime = hours + ":" + minutes + ampm;
        return strTime;
      }

      const body = await request.text()
      const body_json = JSON.parse(body)
      const key = Date.now().toString()
      await MY_KV.put(key, JSON.stringify({
        key: key,
        username: body_json.username,
        title: body_json.title,
        content: body_json.content,
        filecontent: body_json.filecontent,
        filecontentformat: body_json.filecontentformat,
        filecontentposter: body_json.filecontentposter,
        date: getDate(),
        time: formatAMPM(new Date()),
        likes: 0,
        dislikes: 0
      }))
      const headers = {
        'Access-Control-Allow-Origin': '*',
        'Content-type': 'application/json'
      }
      return new Response(key, { headers })
    } 
    else {
      const headers = {
        'Access-Control-Allow-Origin': '*',
        'Content-type': 'application/json'
      }
      return new Response("Expected GET/POST", headers)
    }
  }
  else if (request.url == "https://my-worker.stephenip.workers.dev/posts/like") {
    if (request.method === "POST") {
      const body = await request.text()
      const key = JSON.parse(body).key.toString()
      var post_data = await MY_KV.get(key)
      var post_data_json = JSON.parse(post_data)
      post_data_json.likes += 1
      await MY_KV.put(key, JSON.stringify(post_data_json))
      const headers = {
        'Access-Control-Allow-Origin': '*',
        'Content-type': 'application/json'
      }
      return new Response(JSON.stringify(post_data_json), { headers })
    }
  }
  else if (request.url == "https://my-worker.stephenip.workers.dev/posts/dislike") {
    if (request.method === "POST") {
      const body = await request.text()
      const key = JSON.parse(body).key.toString()
      var post_data = await MY_KV.get(key)
      var post_data_json = JSON.parse(post_data)
      post_data_json.dislikes += 1
      await MY_KV.put(key, JSON.stringify(post_data_json))
      const headers = {
        'Access-Control-Allow-Origin': '*',
        'Content-type': 'application/json'
      }
      return new Response(JSON.stringify(post_data_json), { headers })
    }
  }
  else if (request.url == "https://my-worker.stephenip.workers.dev/posts/unlike") {
    if (request.method === "POST") {
      const body = await request.text()
      const key = JSON.parse(body).key.toString()
      var post_data = await MY_KV.get(key)
      var post_data_json = JSON.parse(post_data)
      post_data_json.likes -= 1
      await MY_KV.put(key, JSON.stringify(post_data_json))
      const headers = {
        'Access-Control-Allow-Origin': '*',
        'Content-type': 'application/json'
      }
      return new Response(JSON.stringify(post_data_json), { headers })
    }
  }
  else if (request.url == "https://my-worker.stephenip.workers.dev/posts/undislike") {
    if (request.method === "POST") {
      const body = await request.text()
      const key = JSON.parse(body).key.toString()
      var post_data = await MY_KV.get(key)
      var post_data_json = JSON.parse(post_data)
      post_data_json.dislikes -= 1
      await MY_KV.put(key, JSON.stringify(post_data_json))
      const headers = {
        'Access-Control-Allow-Origin': '*',
        'Content-type': 'application/json'
      }
      return new Response(JSON.stringify(post_data_json), { headers })
    }
  }
  else {
    return new Response('Not /posts route:', {
      headers: { 'content-type': 'text/plain' }
    })
  }
}
