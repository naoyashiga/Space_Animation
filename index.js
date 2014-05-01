/*-----------------------------------
    グローバル変数
-----------------------------------*/
//blobの数
var INTENSITY = 500;

/*-----------------------------------
    BlobSystemコンストラクタ
-----------------------------------*/
function BlobSystem(ctx,width,height,intensity){
	//blobを入れる配列
	this.blobs = [];
	//量
	this.intensity = intensity;

	//blobを配列に追加する関数
	this.addBlob = function(){
		this.blobs.push(new Blob(ctx,width,height));
	}

	//blobの数だけ繰り返す　0になるとfalse
	while(intensity--){
		this.addBlob();
	}

	//背景を描画する関数
	this.renderBackground = function(){
		var x0 = width / 2;
		var y0 = height / 2;
		//内側の円の半径
		var r0 = width / 8;
		//外側の円の半径
		var r1 = width / 1.5;

		//円形グラデーションの領域
		var grad = ctx.createRadialGradient(x0,y0,r0,x0,y0,r1);
		/*グラデーションの始点と終点
		参考:明度を調節してカラーコードを取得するツール
		http://hexcolortool.com/
		濃い青色から黒色へ
		*/
		grad.addColorStop(0,"#00001B");
		grad.addColorStop(0.5,"#00000E");
		grad.addColorStop(1,"#000002");

		//グラデーションをfillStyleに設定		
		ctx.fillStyle = grad;

		//背景を描画
		ctx.fillRect(0,0,width,height);
	}
	
	//blobを描画する関数
	this.render = function(){
		//ctx.save();

		//背景を描画
		this.renderBackground();

		//blobを描画
		for(var i = 0,blob;blob = this.blobs[i];i++){
			blob.render();
		}
		//ctx.restore();
	}
	//blobのプロパティを更新する関数
	this.update = function(){
		for(var i = 0,blob;blob = this.blobs[i];i++){
			//位置を速度に応じて動かす
			blob.x += blob.vx;
			blob.y += blob.vy;

			//徐々に透明度を上げる
			if(blob.alpha < 1){
				blob.alpha += 0.01;
			}

			//blobが画面の外に出ると、blobを配列から削除する
			if(blob.x < 0 || blob.x > width || blob.y < 0 || blob.y > height){
				//インデックスを指定して配列から削除
				this.blobs.splice(i--,1);
				//新しいblobを追加
				this.addBlob();
			}
			
		}
	}
}

/*-----------------------------------
    最初に実行される関数
-----------------------------------*/
function init(){
	//canvas要素を取得
	var canvas = document.getElementById("c");

	//canvas check
	if(!canvas || !canvas.getContext){
		return false;
	}

	//コンテキストオブジェクトを生成
	var ctx = canvas.getContext("2d");
	//canvasのサイズを設定　windowいっぱいの大きさにする
	var width = canvas.width = window.innerWidth;
	var height = canvas.height = window.innerHeight;


	var blobSystem = new BlobSystem(ctx,width,height,INTENSITY);

	function draw(){
		blobSystem.update();
		blobSystem.render();
		//draw自身を呼び出して、繰り返す
		requestAnimationFrame(draw);
	}

	//最初のdraw関数の実行
	draw();
}

/*-----------------------------------
    Blobコンストラクタ
-----------------------------------*/
function Blob(ctx,width,height){
	//位置
	this.x = width / 2;
	this.y = height  / 2;

	//速度 velocity
	this.vx = getRandomNum(-10,10);
	this.vy = getRandomNum(-10,10);
	//色
	this.color = "#fff";
	/*
	 * colorful
	this.color = Math.floor(Math.random() * 0xFFFFFF).toString(16);
	*/
	//透明度
	this.alpha = 0.2;

	//描画
	this.render = function(){
		//透明度の設定
		ctx.globalAlpha = this.alpha;
		ctx.fillStyle = this.color;
		//長方形を描画して塗りつぶす
		ctx.fillRect(this.x,this.y,this.vx,this.vy / 3);
	};
}

/*-----------------------------------
    範囲を決めて乱数生成
-----------------------------------*/
function getRandomNum(min,max){
	return (Math.random() * (max - min) + min);
}
init();
