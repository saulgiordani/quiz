var path = require('path');

// Postgres
var url 		= 	process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_NAME		=	(url[6] || null);
var user		=	(url[2] || null);
var pwd			=	(url[3] || null);
var protocol	=	(url[1] || null);
var dialect		=	(url[1] || null);
var port		=	(url[5] || null);
var host		=	(url[4] || null);
var storage		=	process.env.DATABASE_STORAGE;

// carga modelo ORM
var Sequelize = require('sequelize');

// usar BBDD SQLite
var sequelize = new Sequelize(DB_NAME, user, pwd, 
		{	dialect: 	protocol,
			protocol: 	protocol,
			port: 		port,
			host: 		host,
			storage: 	storage,
			omitNull: 	true
		}
	);

// importar la definicion de la tabla en quiz.js
var quiz_path = path.join(__dirname, 'quiz');
var Quiz = sequelize.import(quiz_path);

// importar la definiction de la tabla Comment
var comment_path = path.join(__dirname, 'comment');
var Comment = sequelize.import(comment_path);

Comment.belongsTo(Quiz);
Quiz.hasMany(Comment);

exports.Quiz = Quiz;
exports.Comment = Comment;

// sequelize.sync() crea e inicializa tabla de preguntas en DB
sequelize.sync().then(function() {
	// success(...) ejecuta el manejador una vez creada la tabla
	Quiz.count().then(function (count) {
		if(count === 0) {
			// la tabla se inicializa solo se esta vacia
			Quiz.create({	pregunta: 'Capital de Italia',
						 	respuesta: 'Roma',
						 	tema:'humanidades'
						});
			Quiz.create({	pregunta: 'Capital de Portugal',
							respuesta: 'Lisboa',
							tema:'humanidades'
						})
			.then(function(){
				console.log('Base de datos inicializada');
			});
		}
	});
});
