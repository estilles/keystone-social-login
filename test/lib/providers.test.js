var _ = require('underscore'),
	chai = require('chai'),
	expect = chai.expect,
	providers = require('../../lib/providers');

describe('providers .parseProfile()', function () {

	describe('when parsing a facebook profile', function () {
		var raw, parsed;

		before(function() {
			raw = { 
				provider: 'facebook',
				id: '9999999999999999',
				username: undefined,
				displayName: 'John Doe',
				name: {
					familyName: 'Dow',
					givenName: 'John',
					middleName: undefined 
				},
				gender: 'male',
				profileUrl: 'https://www.facebook.com/app_scoped_user_id/9999999999999999/',
				emails: [ { value: 'john.doe@test.com' } ],
				provider: 'facebook',
				_raw: '{"id":"9999999999999999","email":"john.doe\\u0040test.com","first_name":"John","gender":"male","last_name":"Doe","link":"https:\\/\\/www.facebook.com\\/app_scoped_user_id\\/1452888158329891\\/","locale":"en_US","name":"John Doe","timezone":8,"updated_time":"2014-07-03T00:31:01+0000","verified":true}',
				_json: { id: '9999999999999999',
					email: 'john.doe@test.com',
					first_name: 'John',
					gender: 'male',
					last_name: 'Doe',
					link: 'https://www.facebook.com/app_scoped_user_id/9999999999999999/',
					locale: 'en_US',
					name: 'John Doe',
					timezone: 8,
					updated_time: '2014-07-01T00:00:00+0000',
					verified: true
				}
			};

			parsed = providers.facebook.parseProfile(raw._json);
		});

		it('should parse the profile id', function () {
			expect(parsed.id).to.equal(raw._json.id);
		});
		
		it('should parse the profile email', function () {
			expect(parsed.email).to.equal(raw._json.email);
		});
		
		it('should parse the profile name', function () {
			expect(parsed.name).to.equal(raw._json.name);
		});
		
		it('should not parse the profile photo', function () {
			expect(parsed.photoUrl).to.be.null;
		});

		it('should parse the profile url', function () {
			expect(parsed.profileUrl).to.equal(raw._json.link);
		});
		
	});

	describe('when parsing a github profile', function () {
		var raw, parsed;

		before(function() {
			raw = { 
				provider: 'github',
				id: 9999999,
				displayName: 'John Doe',
				username: 'JohnDoe',
				profileUrl: 'https://github.com/JohnDoe',
				emails: [ { value: 'john.doe@test.com' } ],
				_raw: '{"login":"JohnDoe","id":9999999,"avatar_url":"https://avatars.githubusercontent.com/u/9999999?v=2","gravatar_id":"1234567890abcdef1234567890abcdef","url":"https://api.github.com/users/JohnDoe","html_url":"https://github.com/JohnDoe","followers_url":"https://api.github.com/users/JohnDoe/followers","following_url":"https://api.github.com/users/JohnDoe/following{/other_user}","gists_url":"https://api.github.com/users/JohnDoe/gists{/gist_id}","starred_url":"https://api.github.com/users/JohnDoe/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/JohnDoe/subscriptions","organizations_url":"https://api.github.com/users/JohnDoe/orgs","repos_url":"https://api.github.com/users/JohnDoe/repos","events_url":"https://api.github.com/users/JohnDoe/events{/privacy}","received_events_url":"https://api.github.com/users/JohnDoe/received_events","type":"User","site_admin":false,"name":"John Doe","company":"","blog":"","location":"Philippines","email":"john.doe@test.com","hireable":false,"bio":null,"public_repos":3,"public_gists":0,"followers":0,"following":0,"created_at":"2013-09-22T22:36:54Z","updated_at":"2014-08-14T14:50:04Z"}',
				_json: { 
					login: 'JohnDoe',
					id: 9999999,
					avatar_url: 'https://avatars.githubusercontent.com/u/9999999?v=2',
					gravatar_id: '1234567890abcdef1234567890abcdef',
					url: 'https://api.github.com/users/JohnDoe',
					html_url: 'https://github.com/JohnDoe',
					followers_url: 'https://api.github.com/users/JohnDoe/followers',
					following_url: 'https://api.github.com/users/JohnDoe/following{/other_user}',
					gists_url: 'https://api.github.com/users/JohnDoe/gists{/gist_id}',
					starred_url: 'https://api.github.com/users/JohnDoe/starred{/owner}{/repo}',
					subscriptions_url: 'https://api.github.com/users/JohnDoe/subscriptions',
					organizations_url: 'https://api.github.com/users/JohnDoe/orgs',
					repos_url: 'https://api.github.com/users/JohnDoe/repos',
					events_url: 'https://api.github.com/users/JohnDoe/events{/privacy}',
					received_events_url: 'https://api.github.com/users/JohnDoe/received_events',
					type: 'User',
					site_admin: false,
					name: 'John Doe',
					company: '',
					blog: '',
					location: 'Philippines',
					email: 'john.doe@test.com',
					hireable: false,
					bio: null,
					public_repos: 3,
					public_gists: 0,
					followers: 0,
					following: 0,
					created_at: '2013-09-22T22:36:54Z',
					updated_at: '2014-08-14T14:50:04Z'
				} 
			};

			parsed = providers.github.parseProfile(raw._json);
		});

		it('should parse the profile id', function () {
			expect(parsed.id).to.equal(raw._json.id.toString());
		});
		
		it('should parse the profile email', function () {
			expect(parsed.email).to.equal(raw._json.email);
		});
		
		it('should parse the profile name', function () {
			expect(parsed.name).to.equal(raw._json.name);
		});
		
		it('should parse the profile photo', function () {
			expect(parsed.photoUrl).to.equal(raw._json.avatar_url);
		});

		it('should parse the profile url', function () {
			expect(parsed.profileUrl).to.equal(raw._json.html_url);
		});
		
	});

	describe('when parsing a google profile', function () {
		var raw, parsed;

		before(function() {
			raw = { 
				provider: 'google',
				id: '999999999999999999999',
				displayName: 'John Doe',
				name: { 
					familyName: 'Doe', 
					givenName: 'John' 
				},
				emails: [ { value: 'john.doe@test.com' } ],
				_raw: '{\n "id": "999999999999999999999",\n "email": "john.doe@test.com",\n "verified_email": true,\n "name": "John Doe",\n "given_name": "John",\n "family_name": "Doe",\n "link": "https://plus.google.com/999999999999999999999",\n "picture": "https://lh3.googleusercontent.com/1234567890ab/XXXXXXXXXXX/XXXXXXXXXXX/1234567890a/photo.jpg",\n "gender": "male",\n "locale": "en",\n "hd": "Doe.tk"\n}\n',
				_json: { 
					id: '999999999999999999999',
					email: 'john.doe@test.com',
					verified_email: true,
					name: 'John Doe',
					given_name: 'John',
					family_name: 'Doe',
					link: 'https://plus.google.com/999999999999999999999',
					picture: 'https://lh3.googleusercontent.com/1234567890ab/XXXXXXXXXXX/XXXXXXXXXXX/1234567890a/photo.jpg',
					gender: 'male',
					locale: 'en',
					hd: 'test.com' 
				}
			};

			parsed = providers.google.parseProfile(raw._json);
		});

		it('should parse the profile id', function () {
			expect(parsed.id).to.equal(raw._json.id);
		});
		
		it('should parse the profile email', function () {
			expect(parsed.email).to.equal(raw._json.email);
		});
		
		it('should parse the profile name', function () {
			expect(parsed.name).to.equal(raw._json.name);
		});
		
		it('should parse the profile photo', function () {
			expect(parsed.photoUrl).to.equal(raw._json.picture);
		});

		it('should parse the profile url', function () {
			expect(parsed.profileUrl).to.equal(raw._json.link);
		});
		
	});

	describe('when parsing a twitter profile', function () {
		var raw, parsed;

		before(function() {
			raw = { 
				provider: 'twitter',
				id: '9999999999',
				username: 'JohnDoe',
				displayName: 'John Doe',
				photos: [ { value: 'https://abs.twimg.com/sticky/default_profile_images/default_profile_2_normal.png' } ],
				_json: {
					id: 9999999999,                                     
					id_str: '9999999999',                               
					name: 'John Doe',                            
					screen_name: 'JohnDoe',                      
					location: '',                                       
					description: '',                                    
					url: null,                                          
					entities: { description: {} },                
					protected: false,                                   
					followers_count: 1,                                 
					friends_count: 38,                                  
					listed_count: 0,                                    
					created_at: 'Tue Jun 25 22:45:31 +0000 2013',       
					favourites_count: 2,                                
					utc_offset: 28800,                                  
					time_zone: 'Beijing',                               
					geo_enabled: false,                                 
					verified: false,                                    
					statuses_count: 15,                                 
					lang: 'en',                                         
					status: {
						created_at: 'Wed Jul 09 02:50:25 +0000 2014',
						id: 999999999999999999,
						id_str: '999999999999999999',
						text: 'Hello World!',
						source: '<a href="http://twitter.com/#!/download/ipad" rel="nofollow">Twitter for iPad</a>',
						truncated: false,
						in_reply_to_status_id: null,
						in_reply_to_status_id_str: null,
						in_reply_to_user_id: null,
						in_reply_to_user_id_str: null,
						in_reply_to_screen_name: null,
						geo: null,
						coordinates: null,
						place: null,
						contributors: null,
						retweeted_status: [Object],
						retweet_count: 2,
						favorite_count: 0,
						entities: [Object],
						favorited: false,
						retweeted: true,
						lang: 'en' 
					},
					contributors_enabled: false,
					is_translator: false,
					is_translation_enabled: false,
					profile_background_color: 'C0DEED',
					profile_background_image_url: 'http://abs.twimg.com/images/themes/theme1/bg.png',
					profile_background_image_url_https: 'https://abs.twimg.com/images/themes/theme1/bg.png',
					profile_background_tile: false,
					profile_image_url: 'http://abs.twimg.com/sticky/default_profile_images/default_profile_2_normal.png',
					profile_image_url_https: 'https://abs.twimg.com/sticky/default_profile_images/default_profile_2_normal.png',
					profile_link_color: '0084B4',
					profile_sidebar_border_color: 'C0DEED',
					profile_sidebar_fill_color: 'DDEEF6',
					profile_text_color: '333333',
					profile_use_background_image: true,
					default_profile: true,
					default_profile_image: true,
					following: false,
					follow_request_sent: false,
					notifications: false,
					suspended: false,
					needs_phone_verification: false
				} 
			};

			parsed = providers.twitter.parseProfile(raw._json);
		});

		it('should parse the profile id', function () {
			expect(parsed.id).to.equal(raw._json.id_str);
		});
		
		it('should not parse the profile email', function () {
			expect(parsed.email).to.be.null;
		});
		
		it('should parse the profile name', function () {
			expect(parsed.name).to.equal(raw._json.name);
		});
		
		it('should parse the profile photo', function () {
			expect(parsed.photoUrl).to.equal(raw._json.profile_image_url);
		});

		it('should parse the profile url', function () {
			expect(parsed.profileUrl).to.equal('https://twitter.com/' + raw._json.screen_name);
		});
		
	});

});