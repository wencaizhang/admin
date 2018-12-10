layui.use(["layer", "form", "element", "jquery", "laytpl",], function() {
  var element = layui.element;
  var $ = layui.jquery;
  
  $('#logout-btn').on('click', function () {

  })

  //监听导航点击
  element.on("nav(leftNav)", function(elem) {
    if (elem[0].tagName.toLowerCase() === "a") {
      var navA = elem;
      navA
        .parents("li")
        .siblings(".layui-nav-itemed")
        .removeClass("layui-nav-itemed");
    } else {
      var navA = $(elem).find("a");
    }
    var url = navA.attr("data-url");

    if (!url || url === "undefined") {
      return;
    }

    var $iframe = $("#iframe");
    if (url != $iframe.attr("src")) {
      // 切换 iframe 地址
      $iframe.attr("src", url);
      locationHandler(url);
      // 修改面包屑
      breadCrumbHandler();
    }
  });

  function locationHandler(url) {
    window.location = "#" + url;
  }

  function breadCrumbHandler() {
    // 根据左侧菜单动态设置面包屑
    var html = '<a href="">装修商家后台</a>';

    var $this = $("#sideNav .layui-this");
    if (!$this.length) {
      return false;
    }

    if ($this[0].tagName.toLowerCase() === "li") {
      var $a = $this.find("a");
      // html += '<a href="' + $a.attr('data-url') + '">' + $a.attr('data-text') + '</a>'
      html += "<a >" + $a.attr("data-text") + "</a>";
    } else {
      // 二级面包屑
      var $firstSibling = $this.parents(".layui-nav-child").siblings("a");
      html += "<a >" + $firstSibling.attr("data-text") + "</a>";

      // 三级面包屑
      var $childA = $this.find("a");
      html += "<a><cite>" + $childA.attr("data-text") + "</cite></a>";
    }
    $("#layui-breadcrumb").html(html);
    element.render("breadcrumb", "layui-breadcrumb");
  }

  function initIframeSrc() {
    var url = window.location.hash.split("#")[1];
    if (!url) {
      return false;
    }

    // 修改 iframe 路径
    $("#iframe").attr("src", url);

    // 对左侧菜单展开和选中状态进行修正
    var checkedItem = menuList.find(function(item) {
      if (item.href === url) {
        return true;
      }

      if (item.children && item.children.length) {
        var flag = item.children.find(function(item2) {
          return item2.href === url;
        });
        if (flag) {
          return true;
        }
      }
    });

    // 取消全部的高亮状态
    menuList.map(function(item) {
      item.checked = false;
      item.this = false;
      if (item.children && item.children.length) {
        item.children.map(function(item2) {
          item2.checked = false;
          item2.this = false;
        });
      }
    });

    // 高亮对应的
    checkedItem.itemed = true;
    if (checkedItem.href === url) {
      checkedItem.this = true;
    } else {
      checkedItem.children.forEach(function(item) {
        if (item.href === url) {
          item.this = true;
        }
      });
    }
  }

  var laytpl = layui.laytpl;
  var menuList = [
    { title: "首页", href: "./pages/home/index.html", this: true },
    {
      title: "交易管理",
      children: [
        {
          title: "订单管理",
          href: "./pages/deal/order.html"
        }
      ]
    },
    {
      title: "店铺管理",
      children: [
        {
          title: "基本设置",
          href: "./pages/store/basicSetting.html",
        },
        {
          title: "案例设置",
          href: "./pages/store/caseManage.html",
        },
        {
          title: "广告管理",
          href: "./pages/store/adManage.html",
        },
        {
          title: "店铺资质",
          href: "./pages/store/certification.html",
        }
      ]
    },
    {
      title: "客户服务",
      children: [
        {
          title: "投诉管理",
          href: "./pages/service/complain.html"
        },
        {
          title: "问答-待回答",
          href: "./pages/service/answerTodo.html"
        },
        {
          title: "问答-已回答",
          href: "./pages/service/answerDone.html"
        }
      ]
    },
    {
      title: "数据中心",
      children: [
        {
          title: "虚拟币",
          href: "./pages/data/virtualCurrency.html"
        },
      ]
    },
    {
      title: "角色管理",
      children: [
        { title: "角色管理", href: "./pages/roles/roleManage.html" },
        { title: "工长", href: "./pages/roles/supervisor.html" },
        { title: "设计师", href: "./pages/roles/designer.html" }
      ]
    },
    { title: "账号管理", href: "./pages/account/modifyPwd.html" }
  ];

  initIframeSrc();
  var getTpl = sideNavTemplate.innerHTML;
  var view = document.getElementById("sideNav");
  laytpl(getTpl).render(menuList, function(html) {
    // 渲染左侧菜单
    view.innerHTML = html;
    element.render('nav', 'leftNav')
    breadCrumbHandler();
  });
});
