layui.use(['layer', 'form', 'element', 'jquery', ], function() {
	var element = layui.element;
	var $ = layui.jquery;
	//监听导航点击
	element.on('nav(leftNav)', function(elem) {
    if (elem[0].tagName.toLowerCase() === 'a') {
      var navA = elem;
      navA.parents('li').siblings('.layui-nav-itemed').removeClass('layui-nav-itemed')
    } else {
      var navA = $(elem).find('a');
    }
		var id   = navA.attr('data-id');
		var url  = navA.attr('data-url');
		var text = navA.attr('data-text');

    if(!url || url === 'undefined'){ 	return; }

    var $iframe = $('#iframe');
    if (url != $iframe.attr('src')) {
      // 切换 iframe 地址
      $iframe.attr('src', url)
      locationHandler(url);
      // 修改面包屑
      breadCrumbHandler();
    }
  });

  function locationHandler (url) {
    window.location = "#" + url
  }

  function breadCrumbHandler () {
    var html = '<a href="">装修商家后台</a>'

    var $this = $('#sideNav .layui-this')
    if (!$this.length) {
      return false;
    }
    if ($this[0].tagName.toLowerCase() === 'li') {
      var $a = $this.find('a')
      // html += '<a href="' + $a.attr('data-url') + '">' + $a.attr('data-text') + '</a>'
      html += '<a >' + $a.attr('data-text') + '</a>'
    } else {
      // 二级面包屑
      var $firstSiblingA = $this.parents('.layui-nav-child').find('dd:eq(0)').find('a');
      $firstSiblingA.attr('data-text')
      $firstSiblingA.attr('data-url')
      // html += '<a href="' + $firstSiblingA.attr('data-url') + '">' + $firstSiblingA.attr('data-text') + '</a>'
      html += '<a >' + $firstSiblingA.attr('data-text') + '</a>'

      // 三级面包屑
      var $childA = $this.find('a');
      // $childA.attr('data-text')
      // $childA.attr('data-url')
      html += '<a><cite>' + $childA.attr('data-text') + '</cite></a>'
    }
    $('#layui-breadcrumb').html(html)
    element.render('breadcrumb','layui-breadcrumb')
  }
});