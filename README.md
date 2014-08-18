# Keystone Social Login (KSL)

Keystone Social Login is a [Passport](http://passportjs.org/) authentication plugin for the awesome [KeystoneJS](http://keystonejs.com/). Since Keystone Social Login is kind of a mouthfull, let's call it KSL from now on.

KSL is a plugin that allows you to easily Passport-enable your Keystone applications. The initial release of KSL (`0.1.0`) only supports the following Passort strategies.

* Facebook OAuth 2.0 with [passport-facebook](https://github.com/jaredhanson/passport-facebook)
* Google OAuth 2.0 with [passport-google-oauth](https://github.com/jaredhanson/passport-google-oauth)
* GitHub OAuth 2.0 with [passport-github](https://github.com/jaredhanson/passport-github)
* Twitter OAuth with [passport-twitter](https://github.com/jaredhanson/passport-twitter)

>More strategies will be added in future releases.

## Usage
KSL is incredibly easy to use. With four simple steps you can Passport-enable your Keystone application.

1. Require KSL in your `keystone.js` file (or whatever file you use to configure your Keystone app).

        var social = require('keystone-social-login');

2. Configure the KSL plugin (after your `keystone.init()`)

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

3. Inject KSL in your `user model` (after defining the list, but before registering it). You must require KSL in your model as well.
    
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

4. Start the KSL plugin (after setting your app's routes, but before starting Keystone).

        keystone.set('routes', require('./routes'));
        ...
        social.start();
        ...
        keystone.start();

That's it! It's just that simple.

### Installation

KSL is currently not available on [npm](https://www.npmjs.org/). In order to use in your projects you need to include the dependency in your `package.json` file by pointing to the KSL master on GitHub, as follows:

    "dependencies": {
        ...
        "keytone-social-login": "https://github.com/JohnnyEstilles/keystone-social-login.git#master",
        ...
    }

> [KeystoneJS](http://keystonejs.com/) is in the middle of a massive overhaul, that includes the incorporation of a plugin architecture. We have decide to defer the publishing of KSL on [npm](https://www.npmjs.org/) until after he completion of the plugin architecture. You can follow the discussion on [Keystone Issue #535](https://github.com/JedWatson/keystone/issues/535).

### How it works
KSL injects itself into your Keystone application and intercepts the standard Keystone login view, replacing it with its own.

The KSL login view provides icons/links to each of the configured login providers, as well as a link to Keystone's default login view.

KSL also configures passport for you, and it creates routes login and callback routes for each configured provider. The login and callback routes follow the patterns `/social/<provider name>/login` and `/social/<provider name>/callback`, respectively.  Below is a list of the routes created for each provider.

    Provider    Login route             Callback route
    ----------  ----------------------- --------------------------    
    Facebook    /social/facebook/login  /social/facebook/callback
    GitHub      /social/github/login    /social/gihub/callback
    Google      /social/google/login    /social/google/callback
    Twitter     /social/twitter/login   /social/twitter/callback
    
You may use these routes when configuring your Oauth provider, or you can specify custom your own custom routes (see *providers* under *Configuration Options* below.) The protocol, hostname/port portions of the URLs will default to that of your application (obtained from Express' `request` object). So if your application is running on `http://yourdomain.com:3000` the login and callback URLs will be:

`http://yourdomain.com:3000/social/<provider name>/login`

and

`http://yourdomain.com:3000/social/<provider name>/calback`.

### Configuration Options
KSL offers a number of configuration options. The options can be configured using the `.config()` method or the `.set()` method.

    social.config({
        keystone: keystone,
        'signin url: '/your/custom/path',
        'auto create user': true,
        onAuthenticate: yourCallbackFunction,
        providers: {
            google: { ... },
            twitter: { ... }
        }
    });
    
    or
    
    social.set('keystone', keystone);
    social.set('signin url', '/your/custom/path');
    social.set('auto create user', true);
    social.set('onAuthenticate', yourCallbackFunction);
    social.set('providers', {
        google: { ... },
        twitter: { ... }
    });

Below is a comprehensive list of all the available options.

`keystone` *(required)* `object` - must be set to your Keystone object. This option is REQUIRED. KSL will not work without it.

`signin url` *(optional)* `string` - allows you to specify a custom signin view. It defaults to `/social/login`. The default view is visually similar to Keystone's default login view, but displays icons/links to each of the configured providers, along with a link to Keystone's original login view. 

`auto create user` *(optional)* `boolean` - tells KSL whether or not to automatically create users who successfully log in with their social media account, but do not have a Keystone user account. It defaults to `false`. Accounts created this option is set to `true` will be created with `isAdmin` set to `false`.  

`onAuthenticate` *(optional)* `function` - allows you to specify a custom callbacl function to be called by Passport upon successfull social login authentication. Only use this if you want to override KSL's default behavior. This callback is invoked with the following arguments.

    callback(req, accessToken, refreshToken, profile, done);
    
`providers` *(required)* `object` - used to enable each of the available login providers. At least one provider must be enable for KSL to work. Each provider can be configured the following settings.

1. `clientID` *(required)* `string` - the client ID assigned to your app by the Oauth provider.
2. `clientSecret` *(required)* `string` - the client secret assigned to your app by the Oauth provider.

The providers object should be configured as follows:
    
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
    
The currently available provider names are: `facebook`, `github`, `google` and `twitter`.

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

By default, KSL adds the following addition provider specific options.

*Facebook*

    additional: {
    	scope: ['public_profile', 'email'],
		enableProof: false
	}
	
*GitHub*

	additional: {
		scope: [ 'user:email' ]
	}

*Google*

	additional: {
		scope: ['profile', 'email']
	}
	
Twitter

    NONE



### The KSL API
KSL has a very simple API. Most of these methods have already been mentioned above.

#### .set()
Sets a KSL configuration option. For a list of available options see *Configuration Options* above.

    social.set(<option>, <value>);

#### .get()
Returns the current value any KSL configuration option. For a list of available options see *Configuration Options* above.

    variable = social.get(<option>);

#### .config()
Set multiple KSL configuration options in one call.

    social.config({
        <option1>: <value1>,
        <option2>: <value2>,
        <option3>: <value3>,
        ...
    });

#### .start()
Enables KSL once it has been properly configured.

    social.start();

## Techonogies
These are just a few of the technologies I used in the development of KSL.

* [KeystoneJS](http://keystonejs.com/)
* [PassportJS](http://passportjs.org/)
* [Underscore.js](http://underscorejs.org/)
* [Jade](http://jade-lang.com/)
* [{less}](http://lesscss.org/)
* [gulp.js](http://gulpjs.com/)
* [Mocha](http://visionmedia.github.io/mocha/)
* [Chai](http://chaijs.com/)
* [Sinon.js](http://sinonjs.org/)

## Thanks

Special thanks to [@jedwatson](http://twitter.com/jedwatson), [@bladey](http://twitter.com/bladey) and @jossmackison at [Thinkmill](http://www.thinkmill.com.au/) for creating [KeystoneJS](http://keystonejs.com/), as well as to the rest of the [KeystoneJS contributors](https://github.com/JedWatson/keystone/graphs/contributors).

My thanks also to Jared Hanson of [Helixent Technologies, LLC](http://www.helixent.com/) for his work on [PassportJS](http://passportjs.org/) and all the Passport strategies used in this project.

And finally, my thanks to Julien Loutre of [Twenty-Six medias, Inc.](http://www.twenty-six-medias.com/), whose [Social-Login](https://github.com/26medias/social-login) plugin partially inspired this work.

## License
Keystone Social Login is free and open source under the MIT License.

Copyright (c) 2014, Johnny Estilles ([@johnnyestilles](http://twitter.com/JohnnyEstilles))

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
