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
      '" class="file-item thumbnail" style="display: inline-block;">' +
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
    $("#" + file.id).addClass("upload-state-done").attr('data-url', resp.data);

    options.success && options.success(resp)
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

    var $li = $(
      '<div id="' +
      file.id +
      '" class="file-item thumbnail" style="display: inline-block;">' +
      "<img>" +
      "</div>"
    ),
      $img = $li.find("img");

    var fileList = uploader.getFiles();  // 所有状态的文件
    var cancelledFileList = uploader.getFiles('cancelled');  // 被删除状态的文件
    var tempFile = null;
    var filterFils = fileList.filter(function(file) {
      // 过滤出没有被删除的文件
      return cancelledFileList.indexOf(file) == -1
    })

    // 所有状态文件个数是 3 的情况单独处理
    if (fileList.length === 3 || filterFils.length > 2) {
      tempFile = filterFils.shift();
      uploader.removeFile(tempFile, true);
      $("#" + tempFile.id).remove();
    }

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
    $("#" + file.id).addClass("upload-state-done").attr('data-url', resp.data);
    options.success && options.success(resp)
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
