var page = 1;
var limit = 8;
var oLi = $('li');
// 加锁，防止滚动条多次滚动的时候多次触发ajax，多次发送多余的请求
var lock = false;
getData();

function getData() {
    if(!lock){
        $.ajax({
            url : `http://yuanjin.tech:5005/api/movie?page=${page}&limit=${limit}`,
            type : 'GET',
            success : addDom,
            beforeSend : function() {
                $('.loading').show();
            }
            
            
            
        })
        page++;
    }
    
}

// 创建dom结构，依次在最短的li列插入
// 处理返回的数据,该接口返回的数据是对象，obj.data-->name,poster
// <div class="item">
// <div class="imgBox"><img src="./image/0.png" alt=""></div>
// <p class="title">title</p>
// </div> 
function addDom(res){
    $.each(res.data,function(index, ele){
    
    var oItem = $('<div class="item"></div>');
    var oBox = $('<div class="imgBox"></div>');
    var oP = $('<p class="title"></p>');

        var oImg = new Image();
        oImg.src = ele.poster;

        oP.text(ele.name);
        // 当图片加载完再添加dom结构
        oImg.onload = function(){
        oBox.append(oImg);
        oItem.append(oBox).append(oP);
        // 取最短li列的索引
        var index = getminH(oLi);
        // 注意oLi是原生dom的li集合，要用jq语法要用$包裹一下
        $(oLi[index]).append(oItem);
        }
        
        
    })
    // 当加载完dom结构后，开锁
    lock = false;
}

// 判断哪一个li列的高最短，返回最短列的索引值
function getminH(dom){
    // 假设第一个li就是最短的li列
    var minH = parseInt($(dom[0]).css('height')),
        index = 0;

    // 与后面的li列依次比较，交换最短的li的高，取其索引
    for(var i = 1; i < dom.length; i++){
        var ranH = parseInt($(dom[i]).css('height'));
        if(minH > ranH){
            minH = ranH;
            index = i;
            
        }
    }
    return index;
}



// 当滚动条滚动，判断最短li列，即判断边界出现，发送ajax请求
$(window).scroll(function(){
    // 滚动条滚动距离
    var scrollHeight = $(this).scrollTop();
    // 可视窗口高度
    var clientHeight = $(window).height();
    // 最短li高度
    var pageHeigh = this.parseInt($(oLi[getminH(oLi)]).css('height'));

    if (scrollHeight + clientHeight > pageHeigh) {
        getData();
    }
})

