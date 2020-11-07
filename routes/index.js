var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', {
		title: 'Express'
	});
});

//引入数据库模块
var mongoose = require("mongoose");
//1. 连接数据库(使用MongoDB数据库)
mongoose.connect("mongodb://127.0.0.1:27017/thing", function(err) {
	if (err) {
		throw err
	} else {
		console.log("数据库连接成功........")
	}
})

/* 创建待办事项的骨架 */

var thingschema = new mongoose.Schema({
	content: String,
	/* 待办事件 */
	time: String,
	/* 事件记录时间 */
})


var thingModel = mongoose.model("thing", thingschema, "thing");


/* 主页 */
router.get("/index", function(req, res) {
	thingModel.find({}).exec(function(err, data) {
		if (err) {
			throw err
		} else {
			res.render('index', {
				things: data
			})
		}
	})
})

router.get('/thingsadd.html', function(req, res) {
	res.render('thingsadd')
})

/* 增加 */
router.post("/thingadd", function(req, res) {
	var thingadd = new thingModel();



	
	/* 获取要增加的相关数据 */
	var content = req.body.content;
	var time = new Date().toLocaleString('chinese', { hour12: false, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' });

	/* 增加到数据库里 */
	thingadd.content = content;
	thingadd.time = time;
	thingadd.save(function(err) {
		if (err) {
			throw err
		} else {
			res.send("<script>" +
				"location.href = '/index';" +
				"</script>")
		}
	})


})
/* 修改 */
router.get("/change", function(req, res) {

	var id = req.query.id;

	thingModel.findById(id).exec(function(err, data) {
		//data 数据类型是一个对象
		res.render("change", {
			data: data
		})
	})
})

router.post("/changed", function(req, res) {

	var id = req.body.id;
	var content = req.body.content;
	var time = new Date().toLocaleString('chinese', { hour12: false, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' });
	
	thingModel.findById(id).exec(function(err, data ) {
		data.content = content;
		data.time = time;
		data.save(function(err) {
			if (err) {
				throw err;
			} else {
				res.send("<script>" +
					"location.href = '/index';" +
					"</script>")
			}
		})
	})
})

/* 删除 */
router.get("/delete",function(req,res){
	var id = req.query.id;
	// console.log("id是："+id);
	thingModel.findById(id).exec(function(err,data){
		data.remove(function(err){
			if(err){
				throw err;
			}else{
				res.send("<script>"+
				"location.href = '/index';"+
				"</script>")
			}
		})
	})
})




module.exports = router;
