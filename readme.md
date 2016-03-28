#Install

```
npm install --save koa-ga-pageview
```

#Use

```javascript
app = require('koa')();
app.use(require('koa-ga-pageview')('UA-000000-1', '_ga'));
app.use(function* () {
    this.body = 'tracked!';
});
app.listen(8080);
```

#Options

The first argument is the GA property ID. To send pageviews to more than one property, use the middleware more than once.

The second argument is the name of the cookie to use for cid storage.
