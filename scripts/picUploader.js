
function singlePicUploader(options) {

  /**
   *
    options: {
      $fileList: $("#store-fileList"),
      server: "",
      pick: "#store-filePicker",
    }
   */
  var $ = jQuery,
    options = $.extend({
      $fileList: null,
      server: "",
      pick: "",
    }, options),

    $fileList = options.$fileList,

    // 优化retina, 在retina下这个值是2
    ratio = window.devicePixelRatio || 1,

    // 缩略图大小
    thumbnailWidth = 100 * ratio,
    thumbnailHeight = 100 * ratio,

    // Web Uploader实例
    uploader;

  if (!options.pick) {
    alert('请注意，没有参数 pick 为空！')
  }
  if (!options.$fileList) {
    alert('请注意，没有参数 $fileList 为空！')
  }

  // 初始化Web Uploader
  uploader = WebUploader.create({
    // 自动上传。
    auto: true,

    // swf文件路径
    // swf: BASE_URL + '/js/Uploader.swf',

    // 文件接收服务端。
    server: options.server,

    // 选择文件的按钮。可选。
    // 内部根据当前运行是创建，可能是input元素，也可能是flash.
    pick: options.pick,

    fileSingleSizeLimit: 500 * 1024,
    // 只允许选择文件，可选。
    accept: {
      title: "Images",
      extensions: "jpg,jpeg,png",
      mimeTypes: "image/*"
    },

    uploadedFilesCount: 0,
  });

  options.registerDeleteHandler && options.registerDeleteHandler(uploader); // 删除文件事件

  // 当有文件添加进来的时候
  uploader.on("fileQueued", function (file) {
    var fileList = uploader.getFiles()
    fileList.forEach(function (item) {
      if (item.id !== file.id) {
        uploader.removeFile(item, true)
      }
    })

    var $li = $(
      '<div id="' +
      file.id +
      '" class="file-item thumbnail">' +
      "<img>" +
      "</div>"
    ),
      $img = $li.find("img");


    $fileList.find('.thumbnail').remove()
    $fileList.append($li);
    options.renderCallback && options.renderCallback();

    // 创建缩略图
    uploader.makeThumb(
      file,
      function (error, src) {
        if (error) {
          $img.replaceWith("<span>不能预览</span>");
          return;
        }

        $img.attr("src", src);
      },
      thumbnailWidth,
      thumbnailHeight
    );
  });

  // 文件上传过程中创建进度条实时显示。
  uploader.on("uploadProgress", function (file, percentage) {
    var $li = $("#" + file.id),
      $percent = $li.find(".progress span");

    // 避免重复创建
    if (!$percent.length) {
      $percent = $('<p class="progress"><span></span></p>')
        .appendTo($li)
        .find("span");
    }

    $percent.css("width", percentage * 100 + "%");
  });

  // 文件上传成功，给item添加成功class, 用样式标记上传成功。
  uploader.on("uploadSuccess", function (file, resp) {
    $("#" + file.id).addClass("upload-state-done");

    // 页面需要显示成功上传文件的个数
    uploader.options.uploadedFilesCount++
    options.success && options.success(uploader.options.uploadedFilesCount, resp)
  });

  // 文件上传失败，现实上传出错。
  uploader.on("uploadError", function (file) {
    var $li = $("#" + file.id),
      $error = $li.find("div.error");

    // 避免重复创建
    if (!$error.length) {
      $error = $('<div class="error"></div>').appendTo($li);
    }

    $error.text("上传失败");
  });

  // 完成上传完了，成功或者失败，先删除进度条。
  uploader.on("uploadComplete", function (file) {
    $("#" + file.id)
      .find(".progress")
      .remove();
  });

  return uploader;
}

function multiPicUploader(options) {

  /**
   * 
    options: {
      $fileList: $("#store-fileList"),
      server: "",
      pick: "#store-filePicker",
    }
   */
  var $ = jQuery,
    options = $.extend({
      $fileList: null,
      server: "",
      pick: "",
    }, options),

    $fileList = options.$fileList,

    // 优化retina, 在retina下这个值是2
    ratio = window.devicePixelRatio || 1,

    // 缩略图大小
    thumbnailWidth = 100 * ratio,
    thumbnailHeight = 100 * ratio,

    // Web Uploader实例
    uploader;

  if (!options.pick) {
    alert('请注意，没有参数 pick 为空！')
  }
  if (!options.$fileList) {
    alert('请注意，没有参数 $fileList 为空！')
  }

  // 初始化Web Uploader
  uploader = WebUploader.create({
    // 自动上传。
    auto: true,

    // swf文件路径
    // swf: BASE_URL + '/js/Uploader.swf',

    // 文件接收服务端。
    server: options.server,

    // 选择文件的按钮。可选。
    // 内部根据当前运行是创建，可能是input元素，也可能是flash.
    pick: options.pick,

    // 只允许选择文件，可选。
    accept: {
      title: "Images",
      extensions: "jpg,jpeg,png",
      mimeTypes: "image/*"
    },

    uploadedFilesCount: 0,
  });

  options.registerDeleteHandler && options.registerDeleteHandler(uploader); // 删除文件事件

  // 当有文件添加进来的时候
  uploader.on("fileQueued", function (file) {
    var $li = $(
      '<div id="' + file.id + '" class="file-item thumbnail layui-col-xs6 layui-col-sm6 layui-col-md6">\
        <div class="handle">\
          <input type="radio" lay-verify="required" value="' + file.id + '" name="' + options.space + '_cover" value="nan" title="已设为封面">\
          <a href="javascript:;" class="dele-pic-btn">删除</a>\
        </div>\
        <div class="content">\
          <img>\
          <textarea name="' + options.space + '_' + file.id +'_desc" required lay-verify="required" placeholder="  图片描述不少于10个字符，不超过400个字符描述内容包括但不限于（采光、动线、收纳、配色、主题、氛围营造、功能、选材、个性化项目、细节等）；也可以从设计师和业主角度出发，多维度展示案例设计过程" class="layui-textarea" style="display: inline-block;"></textarea>\
        </div>\
      </div>'
    ),
      $img = $li.find("img");

    $fileList.find('.empty-text').addClass('hide')
    $fileList.append($li);
    options.renderCallback && options.renderCallback();

    // 创建缩略图
    uploader.makeThumb(
      file,
      function (error, src) {
        if (error) {
          $img.replaceWith("<span>不能预览</span>");
          return;
        }

        $img.attr("src", src);
      },
      thumbnailWidth,
      thumbnailHeight
    );
  });

  // 文件上传过程中创建进度条实时显示。
  uploader.on("uploadProgress", function (file, percentage) {
    var $li = $("#" + file.id),
      $percent = $li.find(".progress span");

    // 避免重复创建
    if (!$percent.length) {
      $percent = $('<p class="progress"><span></span></p>')
        .appendTo($li)
        .find("span");
    }

    $percent.css("width", percentage * 100 + "%");
  });

  // 文件上传成功，给item添加成功class, 用样式标记上传成功。
  uploader.on("uploadSuccess", function (file, response) {
    $("#" + file.id).addClass("upload-state-done").attr('data-url', resp.data);

    // 页面需要显示成功上传文件的个数
    uploader.options.uploadedFilesCount++
    options.success && options.success(uploader.options.uploadedFilesCount, response)
  });

  // 文件上传失败，现实上传出错。
  uploader.on("uploadError", function (file) {
    $("#" + file.id).addClass("upload-state-done");
    var $li = $("#" + file.id),
      $error = $li.find("div.error");

    // 避免重复创建
    if (!$error.length) {
      $error = $('<div class="error"></div>').appendTo($li);
    }

    $error.text("上传失败");
  });

  // 完成上传完了，成功或者失败，先删除进度条。
  uploader.on("uploadComplete", function (file) {
    $("#" + file.id)
      .find(".progress")
      .remove();
  });

  return uploader;
}

function designerMultiPicUploader(options) {

  /**
   * 
    options: {
      $fileList: $("#store-fileList"),
      server: "",
      pick: "#store-filePicker",
    }
   */
  var $ = jQuery,
    options = $.extend({
      $fileList: null,
      server: "",
      pick: "",
    }, options),

    $fileList = options.$fileList,

    // 优化retina, 在retina下这个值是2
    ratio = window.devicePixelRatio || 1,

    // 缩略图大小
    thumbnailWidth = 100 * ratio,
    thumbnailHeight = 100 * ratio,

    // Web Uploader实例
    uploader;

  if (!options.pick) {
    alert('请注意，没有参数 pick 为空！')
  }
  if (!options.$fileList) {
    alert('请注意，没有参数 $fileList 为空！')
  }

  // 初始化Web Uploader
  uploader = WebUploader.create({
    // 自动上传。
    auto: true,

    // swf文件路径
    // swf: BASE_URL + '/js/Uploader.swf',

    // 文件接收服务端。
    server: options.server,

    // 选择文件的按钮。可选。
    // 内部根据当前运行是创建，可能是input元素，也可能是flash.
    pick: options.pick,

    // 只允许选择文件，可选。
    accept: {
      title: "Images",
      extensions: "jpg,png",
      mimeTypes: "image/*"
    },

    uploadedFilesCount: 0,
  });

  options.registerDeleteHandler && options.registerDeleteHandler(uploader); // 删除文件事件

  // 当有文件添加进来的时候
  uploader.on("fileQueued", function (file) {
    var $li = $(
      '<div id="' + file.id + '" class="file-item thumbnail dib" style="margin-right: 20px;">\
        <div class="content">\
          <img>\
        </div>\
        <div class="handle" style="text-align: center;">\
          <a href="javascript:;" class="dele-pic-btn high-light-text">删除</a>\
        </div>\
      </div>'
    ),
      $img = $li.find("img");

    $fileList.find('.empty-text').addClass('hide')
    $fileList.append($li);
    options.renderCallback && options.renderCallback();

    // 创建缩略图
    uploader.makeThumb(
      file,
      function (error, src) {
        if (error) {
          $img.replaceWith("<span>不能预览</span>");
          return;
        }

        $img.attr("src", src);
      },
      thumbnailWidth,
      thumbnailHeight
    );
  });

  // 文件上传过程中创建进度条实时显示。
  uploader.on("uploadProgress", function (file, percentage) {
    var $li = $("#" + file.id),
      $percent = $li.find(".progress span");

    // 避免重复创建
    if (!$percent.length) {
      $percent = $('<p class="progress"><span></span></p>')
        .appendTo($li)
        .find("span");
    }

    $percent.css("width", percentage * 100 + "%");
  });

  // 文件上传成功，给item添加成功class, 用样式标记上传成功。
  uploader.on("uploadSuccess", function (file, response) {
    $("#" + file.id).addClass("upload-state-done");

    // 页面需要显示成功上传文件的个数
    uploader.options.uploadedFilesCount++
    options.success && options.success(uploader.options.uploadedFilesCount, response)
  });

  // 文件上传失败，现实上传出错。
  uploader.on("uploadError", function (file) {
    var $li = $("#" + file.id),
      $error = $li.find("div.error");

    // 避免重复创建
    if (!$error.length) {
      $error = $('<div class="error"></div>').appendTo($li);
    }

    $error.text("上传失败");
  });

  // 完成上传完了，成功或者失败，先删除进度条。
  uploader.on("uploadComplete", function (file) {
    $("#" + file.id)
      .find(".progress")
      .remove();
  });

  return uploader;
}