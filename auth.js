require('nodefly').profile(
    'ff6782d5-487c-4385-8f30-f13786239858',
	['mongochess','Heroku']
)

auth = {
	'server' : 'alex.mongohq.com'
	,'database' : 'app13760571' 
	,'user' : 'heroku'
	,'password' : 'Dominica!<3'
}

if(module)
  module.exports.auth = auth;