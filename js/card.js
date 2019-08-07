
    var deck = ["deck_rj", "deck_rj", "deck_rq", "deck_rq", "deck_rk", "deck_rk"];//牌面的预先设置,把图片名字存在数组中，以便于后面好调用
    var $oncemoreButton=$("#oncemore");//再玩一次按钮设置
    var $result=$("#result");//显示结果块获取
    var rightCount;//匹配次数，用于后面设置，翻牌配对成功一次加一，翻牌三次，就代表游戏结束，玩家成功
    var interId;//计时器id
    var time=0;//时间，计算时间再对其进行格式化

    //洗牌函数,实际是一个随机函数，用0.5做分界线用来判断是升序还是降序
    function shuffle() {
        return Math.random() > 0.5 ? -1 : 1;//用一个随机函数分别代表-1、1来让数组随机升序降序排列从而实现了数组的随机排列
	}
	
	
	//页面加载完毕后需要准备的桌面
    $(function() {
	var $card = $(".card");//获取一个纸牌块，该块用来放牌的正反面图片
	
    //复制一个牌块，一块用来存放一张牌（一张牌用正面图片和反面图片组成），需要复制数组长度的块用来存放这么多张牌
    for(var i = 0; i < deck.length-1; i++) {
		$card.clone().insertAfter($card);
		}
		
    //开始游戏，准备好直接开始游戏
    startPlay();
	
    //点击“Play Again"，游戏完了以后还可以点击重玩一次
    $oncemoreButton.click(function(){
		startPlay();
	})
		});
			
   //翻牌函数，用来设置翻牌效果
   function selectCard() {
   //防止翻第3张牌，翻了两张牌就不能再翻另一张牌
       if($(".cardFlipped").length > 1) {
	   return;
		 }
		 
       $(this).addClass("cardFlipped");//点击了就添加翻牌效果
	   var $fcards = $(".cardFlipped");//得到具有翻牌效果的所有元素
	   
	   //有2张牌翻时，检测是否匹配
	   if($fcards.length == 2) {
		   
	   //必须加延时
		setTimeout(function() {
			checkPattern($fcards);//调用判断函数
					}, 700);
		}

		}
			
    //检测牌是否匹配
    function checkPattern($cards) {
	    var pattern1 = $($cards[0]).data("pattern");//只能用data方法来获取自定义的属性，而该属性的值也正是照片名称，从而用名称来判断值是否相等
	    var pattern2 = $($cards[1]).data("pattern");
		
	    if(pattern1 == pattern2) {
		    //两张牌相等，就移除牌
		    $cards.addClass("cardRemove");//添加移除牌的属性
		    rightCount++;//配对成功次数，计数加1
		
		//如果配对成功三次，说明游戏结束，应该显示结果
		if(rightCount==3){
		    clearInterval(interId);//清除计时，暂停计时
		    $oncemoreButton.show();//显示再玩一次按钮
			
		    //处理时间后显示结果
		    $result.text("Your Score:"+dealTime()).addClass("showResult");
		   }
			}
		$cards.removeClass("cardFlipped");
			}
			
	//处理时间格式函数
	function dealTime(){
		var res=null;
		if(time<60){
		   if(time<10){
				time="0"+time;
					}
				res="00:"+time;
				}
		else
		{
			var x=parseInt(time/60);
			var y=time-x*60;
			if(x<10){
					res="0"+x+":"+y;
					}else{
						res=x+":"+y;
					}
				}
				return res;
			}
	//时间计时
	function calculate(){
			time+=1;
			}
			
	//开始游戏
	function startPlay(){
		time=0;//每次开始游戏都要进行重新计数
		$result.removeClass("showResult");//移除显示结果块的属性，从而让结果块隐藏
		$oncemoreButton.hide();//隐藏再玩一次按钮
		rightCount=0;//重置配对正确次数
		deck.sort(shuffle);//打乱数组，从而打乱照片位置
		var $card = $(".card");//获取所有的纸牌块
		$card.removeClass("cardRemove");//移除所有隐藏纸片属性，从而让纸牌都显示出来
		$card.find(".back").removeClass().addClass("back");//重置背面的所有属性
		
		//利用each方法来遍历所有数组的元素
		$(".card").each(function(index) {
				var pattern = deck[index];//获取每一个数组的元素名字（同时也是照片名称）
				$(this).data("pattern", pattern);//用data方法来自定义属性，给pattern属性添加数组元素（照片名字）值
				$(this).find(".back").addClass(pattern);//给所有背面（也就是纸牌的正面添加照片名字值），用于判断后续需要比较的两张牌是否相同
				$(this).click(selectCard)//点击翻牌会有翻牌效果
				});
		//每秒计时一次
		interId=setInterval(calculate,1000);
			}
			