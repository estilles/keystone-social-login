# Keystone Social Login (KSL)

[![Build Status][travis-badge]][travis-url]
[![Dependency Status][dm-badge]][dm-url]

>WARNING: KSL is not yet compatible with the last Keystone release (0.3.x). It is, however, still compatible with release 0.2.42. While my intent is to updated KSL to work with Keystone 0.3.x, such updated is pending Keystone's decision to officially implement a [plugin architecture][keystone-issue-912]. Once this issue is resolved I will continue development of KSL.

Keystone Social Login is a [Passport][passport] authentication plugin for the awesome [KeystoneJS][keystone]. Since Keystone Social Login is kind of a mouthful, let's call it *KSL* from now on.

*KSL* is a plugin that allows you to easily Passport-enable your Keystone applications. The initial release of *KSL* (`0.1.0`) only supports the following Passport strategies.

* Facebook OAuth 2.0 with [passport-facebook][passport-facebook]
* Google OAuth 2.0 with [passport-google-oauth][passport-google-oauth]
* GitHub OAuth 2.0 with [passport-github][passport-github]
* Twitter OAuth with [passport-twitter][passport-twitter]

>More strategies will be added in future releases.

## How it works
*KSL* injects itself into your Keystone application and intercepts the standard Keystone login view, replacing it with its own.

### New Login View
The *KSL Login View* provides icons/links to each of the configured login providers, as well as a link to Keystone's default login view. This is the *KSL Login View* when all providers are configured.

![Login View][ksl-login-view]

### Automatic Passport Configuration
*KSL* also configures passport for you, and creates login and callback routes for each configured provider. The login and callback routes follow the patterns `/social/<provider>/login` and `/social/<provider>/callback`, respectively.  Below is a list of the default routes created for each provider.

Provider   | Login route             | Callback route
---------- | ----------------------- | --------------------------
Facebook   | /social/facebook/login  | /social/facebook/callback
GitHub     | /social/github/login    | /social/github/callback
Google     | /social/google/login    | /social/google/callback
Twitter    | /social/twitter/login   | /social/twitter/callback

You should use these routes when configuring your Oauth provider. However, if you prefer, you can specify your own custom routes paths (see [providers](#providers) under [Configuration Options](#configuration-options) below.) As you can see, only the path portion of the URL needs to be provided to *KSL*. The protocol and hostname/port portions of the URLs will default to that of your application (obtained from the Express `request` object). So if your application is running on `http://yourdomain.com:3000` the login and callback URLs will be:

`http://yourdomain.com:3000/social/<provider>/login`

and

`http://yourdomain.com:3000/social/<provider>/callback`.

### Automatic Updates to User List/Schema
For every provider configured, *KSL* adds a Keystone Field to the *User List* that represents a user-friendly unique ID for the user. Each of these fields, which I call the *Provider Login Ids*, corresponds to the user's actual login/user ID for each provider and will be used as an alternate lookup field when a user signs in with a social media account and *KSL* is unable to locate the User document using the provider profile ID.  

You can use the *Provider Login Ids* to pre-authorize users to sign in using one or more providers. Here's a list of all the *Provider Login Id* fields along with the corresponding profile field to which they map for every each provider.

Provider   | User Field         | Mapped to (Provider Profile)
---------- | ------------------ | ---------------------------------
Facebook   | facebookLoginId    | Facebook Profile E-Mail Address
GitHub     | githubLoginId      | GitHub Login Name
Google     | googleLoginId      | Google E-Mail Address
Twitter    | twitterLoginId     | Twitter Screen Name

> NOTE: `facebookLoginId` was originally mapped to the Facebook `username` field, wich is now deprecated as of Facebook Platform API version 2.0. This has forced me to use the Facebook profile `email` address. Unfortunately, the availability of the user's Facebook profile `email` address will be dependent on the user's Facebook profile security settings. Therefore, if a user disallows access to his e-mail address on his Facebook profile it will not be possible to pre-authorize login to Keystone using this individual's Facebook e-mail.  

These fields will appear in the Keystone Admin UI as follows:

![User Fields][ksl-user-fields]

Depending on which providers you configure, one or more of the following fields will be added to you Keystone *User List*.

*For Facebook:*
```JavaScript
facebookLoginId: {
    type: String,
    label: 'Facebook E-Mail',
    width: 'medium',
    initial: true,
    index: true
}
```
*For GitHub:*
```JavaScript
githubLoginId: {
    type: String,
    label: 'GitHub Login',
    width: 'medium',
    initial: true,
    index: true
}
```
*For Google:*
```JavaScript
googleLoginId: {
    type: String,
    label: 'Google E-Mail',
    width: 'medium',
    initial: true,
    index: true
}
```
*For Twitter:*
```JavaScript
twitterLoginId: {
    type: String,
    label: 'Twitter Screen Name',
    width: 'medium',
    initial: true,
    index: true
}
```

In addition to the *Provider Login Id* fields, *KSL* will add the following fields to the *User List* `schema` for every provider configured.  These fields are retrieved from the user's profile and updated during the authentication process.

```JavaScript
social: {
    <provider>: {
		id: { type: String, index: true },
		name: { type: String },
		email: { type: String },
		photoUrl : { type: String },
		profileUrl : { type: String },
		accessToken: { type: String },
		refreshToken: { type: String }
	}
}
```

> NOTES:
>
> - The *Twitter* Oauth provider does not return an e-mail address, so `social.twitter.email` will always be `null`.
> - Not all providers return a *refreshToken*. When not available, `social.<provider>.refreshToken` will be `null`.

## Usage
*KSL* is incredibly easy to use. With four simple steps you can Passport-enable your Keystone application.

Step 1. Require *KSL* in your `keystone.js` file (or whatever file you use to configure your Keystone app).

```JavaScript
var social = require('keystone-social-login');
```

Step 2. Configure the *KSL* plugin (after your `keystone.init()`)

```JavaScript
keystone.init(...);
...
social.config({
    keystone: keystone,
    providers: {
        google: {
            clientID: 'your-client-id',
            clientSecret: 'your-client-secret'
        },
        facebook: {
            clientID: 'your-client-id',
            clientSecret: 'your-client-secret'
        },
        github: {
            clientID: 'your-client-id',
            clientSecret: 'your-client-secret'
        },
        twitter: {
            clientID: 'your-client-id',
            clientSecret: 'your-client-secret'
        }
    }
});
```

Step 3. Inject *KSL* into your `user model` (after defining the list, but before registering it). You must require *KSL* in your model as well.

```JavaScript
var social = require('keystone-social-login');
...
User.add({
   name: { type: Types.Name, required: true, index: true },
   email: { type: Types.Email, initial: true, required: true, index: true },
   password: { type: Types.Password, initial: true }
}, 'Permissions', {
   isAdmin: { type: Boolean, label: 'Can access Keystone', index: true }
});
...
social.plugin(User);
...
User.register();
```

Step 4. Start the *KSL* plugin (after setting your app's routes, but before starting Keystone).

```JavaScript
keystone.set('routes', require('./routes'));
...
social.start();
...
keystone.start();
```

That's it! It's just that simple.

### Installation

*KSL* is currently not available on [npm][npm]. In the meantime you can install it directly from this repository.

```
npm install --save JohnnyEstilles/keystone-social-login
```

> [KeystoneJS][keystone] is in the middle of a massive overhaul, that includes the incorporation of a plugin architecture. We have decide to defer the publishing of *KSL* on [npm](https://www.npmjs.org/) until after he completion of the plugin architecture. <del>You can follow the discussion on [Keystone Issue #503](https://github.com/JedWatson/keystone/issues/503).</del> Discussion of Keystone's plugin architecture was moved to [Issue #912][keystone-issue-912].

### Configuration Options
*KSL* offers a number of configuration options. The options can be configured using the `.config()` method or the `.set()` method.

```JavaScript
social.config({
    keystone: keystone,
    'signin url': '/your/custom/path',
    'auto create user': true,
    onAuthenticate: yourCallbackFunction,
    providers: {
        google: { ... },
        twitter: { ... }
    }
});
```
or
```JavaScript
social.set('keystone', keystone);
social.set('signin url', '/your/custom/path');
social.set('auto create user', true);
social.set('onAuthenticate', yourCallbackFunction);
social.set('providers', {
    google: { ... },
    twitter: { ... }
});
social.init()
```

The `.config()` method automatically calls the `.init()` method. If you prefer to use the `.set()` method make sure you call the `.init()` method once you're done.

Below is a comprehensive list of all the available options.

`keystone` *(required)* `object` - must be set to your Keystone object. This option is REQUIRED. *KSL* will not work without it.

`signin url` *(optional)* `string` - allows you to specify a custom signin view. It defaults to `/social/login`. The default view is visually similar to Keystone's default login view, but displays icons/links to each of the configured providers, along with a link to Keystone's original login view. A preview of the default login view is displayed above in the *New Login View* section.

`auto create user` *(optional)* `boolean` - tells *KSL* whether or not to automatically create users who successfully log in with their social media account, but do not have a Keystone user account. It defaults to `false`. Accounts created this option is set to `true` will be created with `isAdmin` set to `false`, as well as the `name` and `email` fields set to their corresponding values in the provider's profile (when available).  

`onAuthenticate` *(optional)* `function` - allows you to specify a custom callback function to be called by Passport upon successfull authentication with the social login provider. This callback will be invoked as follows:

```JavaScript
callback(req, accessToken, refreshToken, profile, done);
```

 Where:

 1. `req` is the request object
 2. `accessToken` is a `string` containing the provider supplied access token
 3. `refreshToken` is a `string` containing the provider supplied refresh token (if one is available)
 4. `done` is a callback completion function, called as follows: `done(err, user)`. It informs Passport when you function is, well, done! Pass an `Error` object in `err` when you wish to signal that an error occured, and a `User` object to tell Passport which user to log in.

> NOTE: Only use this if you need to override *KSL's* default authentication behavior.

<a name="providers"></a>`providers` *(required)* `object` - used to enable each of the available login providers. At least one provider must be enable for *KSL* to work. The providers object should be configured as follows:

```JavaScript
providers: {
    <name>: {
        clientID: 'your-apps-client-id',
        clientSecret: 'your-apps-client-secret'
    },
    <name>: {
        clientID: 'your-apps-client-id',
        clientSecret: 'your-apps-client-secret'
    }
}
```

Each provider can be configured the following settings.

1. `clientID` *(required)* `string` - the client ID assigned to your app by the Oauth provider.
2. `clientSecret` *(required)* `string` - the client secret assigned to your app by the Oauth provider.
3. `url` *(optional)* `object` - allows you to customize the login and callback urls for this provider.

        providers: {
            <name>: {
                clientID: 'your-apps-client-id',
                clientSecret: 'your-apps-client-secret',
                url: {
                    login: '/path/to/login',
                    callback: '/path/to/callback'
                }
            }
        }

4. `additional` *(optional)* `object` - allows you to pass additional provider specific options.

        providers: {
            <name>: {
                clientID: 'your-apps-client-id',
                clientSecret: 'your-apps-client-secret',
                additional: {
                    option1: 'value1',
                    option2: 'value2'
                }
            }
        }

>NOTE: By default, *KSL* adds the following *additional* provider specific options.

*Facebook*
```JavaScript
additional: {
	scope: ['public_profile', 'email'],
	enableProof: false
}
```
*GitHub*
```JavaScript
additional: {
	scope: [ 'user:email' ]
}
```
*Google*
```JavaScript
additional: {
	scope: ['profile', 'email']
}
```
*Twitter*
```
NONE
```

### The KSL API
*KSL* has a very simple API. Most of these methods have already been mentioned above.

#### .set()
Sets a *KSL* configuration option. (For a list of available options see *Configuration Options* above.)
```JavaScript
social.set(<option>, <value>);
```

#### .get()
Returns the current value any *KSL* configuration option. (For a list of available options see *Configuration Options* above.)
```JavaScript
variable = social.get(<option>);
```

#### .init
Initializes *Passport* within *KSL*. The `.init()` method is automatically called by the `.config()` method below. You ONLY need to use this method if you use `.set()` to configure *KSL* instead of the `.config()`.
```JavaScript
social.init()
```

#### .config()
Set multiple *KSL* configuration options in one call.
```JavaScript
social.config({
    <option1>: <value1>,
    <option2>: <value2>,
    <option3>: <value3>,
    ...
});
```

#### .start()
Enables *KSL* once it has been properly configured.
```JavaScript
social.start();
```

## Thanks

Special thanks to [@jedwatson][jedwatson], [@bladey][bladey] and [@jossmackison][jossmackison] at [Thinkmill][thinkmill] for creating [KeystoneJS][keystone], as well as to the rest of the [KeystoneJS contributors][keystone-contributors].

Many thanks to Jared Hanson of [Helixent Technologies, LLC][helixent] for his work on [PassportJS][passport] and all the Passport strategies used in this project.

My thanks also to Sharad Kumar ([@eJugnoo](http://twitter.com/eJugnoo)) for helping me proofread my docs. (I'm the worst proofreader ever!)

And finally, my thanks to Julien Loutre of [Twenty-Six medias, Inc.][26medias], whose [Social-Login][26medias-social-login] plugin partially inspired this work.

## License
Keystone Social Login is free and open source under the MIT License.

Copyright (c) 2014-2015, [Johnny Estilles][jme], http://www.agentia.asia

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

[travis-badge]: https://travis-ci.org/JohnnyEstilles/keystone-social-login.svg?branch=master
[travis-url]: https://travis-ci.org/JohnnyEstilles/keystone-social-login

[dm-badge]: https://david-dm.org/JohnnyEstilles/keystone-social-login.svg
[dm-url]: https://david-dm.org/JohnnyEstilles/keystone-social-login

[ksl-login-view]: http://res.cloudinary.com/agentia/image/upload/v1408407828/keystone-social-login/login.png
[ksl-user-fields]: http://res.cloudinary.com/agentia/image/upload/v1408407827/keystone-social-login/user-fields.png

[keystone]: http://keystonejs.com/
[keystone-contributors]: https://github.com/keystonejs/keystone/graphs/contributors
[keystone-issue-912]: https://github.com/keystonejs/keystone/issues/912

[jedwatson]: http://twitter.com/jedwatson
[bladey]: http://twitter.com/bladey
[jossmackison]: http://twitter.com/jossmackison
[thinkmill]: http://www.thinkmill.com.au/

[passport]: http://passportjs.org/
[passport-facebook]: https://github.com/jaredhanson/passport-facebook
[passport-google-oauth]: https://github.com/jaredhanson/passport-google-oauth
[passport-github]: https://github.com/jaredhanson/passport-github
[passport-twitter]: https://github.com/jaredhanson/passport-twitter

[helixent]: http://www.helixent.com/

[npm]: https://www.npmjs.org/

[26medias]: http://www.twenty-six-medias.com/
[26medias-social-login]: https://github.com/26medias/social-login

[jme]: https://github.com/JohnnyEstilles
[agentia]: http://www.agentia.asia
