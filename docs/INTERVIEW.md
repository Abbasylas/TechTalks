1)
    a) I expect the employee profile to run on the server side because it contains sensitive information that should not be public access to any regular client
    b) client side with an async server component inside its own suspense boundary, because the process of fetching data might take a bit of time, suspense is used so that the user does not have an empty screen for the duration, but rather has a loading screen instead. After the data is fetched, the user is able to see it on the UI at the client side.
    c) Buttons should always be on the client side since it is a way for the client to interact with the website and cause a certain function to work.

2) Local storage data should remain visible as well as a loading text/screen/component should be visible to the client while the server fetches data

3) No, suspense only works on asynchronous events during the inital render phase, wrapping a click-handler to fetch data disrupts this process since the event will already be rendered and thus unable to be intercepted by suspense.

4) yes, because the web server cant handle a certain request at the moment, fetch will throw