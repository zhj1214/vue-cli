var getFilePath = function(picUrl) {
  return new Promise(function(resolve, reject) {
    uni.downloadFile({
      url: picUrl,
      success: function(res) {
        console.log(res);
        // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
        if (res.statusCode === 200) {
          resolve(res.tempFilePath);
        }
      },
      fail: function(err) {
        console.log(err, picUrl);
        resolve(picUrl);
      },
    });
  });
};

/**
 * 分享朋友圈
 * @param {*} id
 * @param {*} options
 * @param {*} callback
 */
export async function drawShareImg(
  id,
  options = {
    dpr: 3,
    imgUrl: '/static/images/store/goods/goods.png',
    qrCodeUrl: '/static/images/store/goods/goods.png',
    title: '【小李子@我】快来看看',
    name: '迪奥(Dior)烈艳蓝金口红哑光999',
    price: '¥ 299.00',
    originPrice: '¥ 398.00',
    tip: '长按进入小程序',
  },
  callback
) {
  uni.showLoading({
    title: '生成中...',
  });

  const imgUrl = await getFilePath(options.imgUrl);
  const qrCodeUrl = await getFilePath(options.qrCodeUrl);

  const ctx = uni.createCanvasContext(id);
  const dpr = options.dpr || 2;

  const left = 10 * dpr;

  // 文字换行
  function drawtext(
    ctx,
    t,
    x,
    y,
    w,
    lineHeight = 17 * dpr,
    withLineThrough = false,
    limit = 1
  ) {
    //参数说明
    //ctx：canvas的 2d 对象，t：绘制的文字，x,y:文字坐标，w：文字最大宽度
    let chr = t.split('');
    let temp = '';
    let row = [];

    for (let a = 0; a < chr.length; a++) {
      if (
        ctx.measureText(temp).width < w &&
        ctx.measureText(temp + chr[a]).width <= w
      ) {
        temp += chr[a];
      } else {
        row.push(temp);
        temp = chr[a];
      }
    }
    row.push(temp);

    for (let b = 0; b < row.length; b++) {
      // 限制行数
      if (limit <= b) break;

      if (limit === b + 1 && row[limit] && row[limit].length) {
        row[b] = row[b].slice(0, -1) + '...';
      }
      ctx.fillText(row[b], x, y + (b + 1) * lineHeight);

      if (withLineThrough) {
        ctx.setStrokeStyle('#333333');
        ctx.setLineWidth(2);
        ctx.moveTo(x - 10, y + ((b + 1) * lineHeight) / 1.3);
        ctx.lineTo(
          x + ctx.measureText(temp).width + 10,
          y + ((b + 1) * lineHeight) / 1.3
        );
      }
    }
  }
  // 绘制白底
  ctx.setFillStyle('white');
  ctx.fillRect(0, 0, 230 * dpr, 410 * dpr);

  //绘制文本信息
  ctx.setFillStyle('#444444');
  ctx.setFontSize(10 * dpr);
  drawtext(ctx, options.title, left, 10 * dpr, 210 * dpr, 14 * dpr);

  ctx.drawImage(imgUrl, left, 34 * dpr, 210 * dpr, 210 * dpr);

  //绘制文本信息
  ctx.setFillStyle('#2E2E2E');
  ctx.setFontSize(10 * dpr);
  drawtext(ctx, options.name, left, 256 * dpr, 120 * dpr, 14 * dpr, false, 2);

  ctx.setFillStyle('#FF4C4C');
  ctx.setFontSize(14 * dpr);
  drawtext(
    ctx,
    options.price,
    left + 120 * dpr + 14 * dpr,
    256 * dpr,
    80 * dpr
  );
  ctx.setFillStyle('#929497');
  ctx.setFontSize(10 * dpr);
  if (options.originPrice) {
    drawtext(
      ctx,
      options.originPrice,
      left + 120 * dpr + 24 * dpr,
      276 * dpr,
      70 * dpr,
      14 * dpr,
      true
    );
  }

  ctx.setStrokeStyle('#DADADA');
  ctx.moveTo(10 * dpr, 302 * dpr);
  ctx.lineTo(10 * dpr + 210 * dpr, 302 * dpr);

  ctx.drawImage(qrCodeUrl, 75 * dpr, 309 * dpr, 80 * dpr, 80 * dpr);
  ctx.setFillStyle('#5D5D5D');
  ctx.fillText(options.tip, 36 * dpr, 353 * dpr + 11 * dpr + 40 * dpr);
  ctx.stroke();
  ctx.draw();

  setTimeout(function() {
    uni.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: 460,
      height: 820,
      destWidth: 460,
      destHeight: 820,
      quality: 1,
      canvasId: id,
      success: function(res) {
        console.log(res);
        uni.hideLoading();
        callback && callback(res.tempFilePath);
      },
      fail: function(err) {
        console.log(err);
        //TODO
      },
      complete() {
        uni.hideLoading();
      },
    });
  }, 500);
}

/**
 * 分享好友
 */
export async function drawShareFriendsImg(id, options, callback) {
  const ctx = uni.createCanvasContext(id);
  const dpr = options.dpr || 2;

  const imgUrl = await getFilePath(options.imgUrl);
  const bgUrl = await getFilePath(options.bgUrl);

  // const imgUrl = options.imgUrl;
  // const bgUrl = options.bgUrl;

  // 绘制白底
  ctx.setFillStyle('white');
  ctx.fillRect(0, 0, 210 * dpr, 120 * dpr);
  console.log('do it');
  // 文字换行
  function drawtext(
    ctx,
    t,
    x,
    y,
    w,
    lineHeight = 17 * dpr,
    withLineThrough = false,
    limit = 1
  ) {
    //参数说明
    //ctx：canvas的 2d 对象，t：绘制的文字，x,y:文字坐标，w：文字最大宽度
    let chr = t.split('');
    let temp = '';
    let row = [];

    for (let a = 0; a < chr.length; a++) {
      if (
        ctx.measureText(temp).width < w &&
        ctx.measureText(temp + chr[a]).width <= w
      ) {
        temp += chr[a];
      } else {
        row.push(temp);
        temp = chr[a];
      }
    }
    row.push(temp);

    for (let b = 0; b < row.length; b++) {
      // 限制行数
      if (limit <= b) break;

      if (limit === b + 1 && row[limit] && row[limit].length) {
        row[b] = row[b].slice(0, -1) + '...';
      }
      ctx.fillText(row[b], x, y + (b + 1) * lineHeight);

      if (withLineThrough) {
        ctx.setStrokeStyle('#929497');
        ctx.setLineWidth(2);
        ctx.moveTo(x - 10, y + ((b + 1) * lineHeight) / 1.3);
        ctx.lineTo(
          x + ctx.measureText(temp).width + 10,
          y + ((b + 1) * lineHeight) / 1.3
        );
      }
    }
  }

  // 绘制背景
  ctx.drawImage(bgUrl, 0, 0, 210 * dpr, 120 * dpr);
  // 绘制商品图片
  ctx.drawImage(imgUrl, 0, 0, 120 * dpr, 120 * dpr);

  ctx.setFillStyle('#FF4C4C');
  ctx.setFontSize(14 * dpr);
  drawtext(ctx, options.price, 130 * dpr, 38 * dpr, 70 * dpr);

  ctx.setFillStyle('#929497');
  ctx.setFontSize(10 * dpr);
  if (options.originPrice) {
    drawtext(
      ctx,
      options.originPrice,
      130 * dpr,
      58 * dpr,
      70 * dpr,
      14 * dpr,
      true
    );
  }

  ctx.stroke();

  ctx.draw();

  setTimeout(() => {
    uni.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: 420,
      height: 336,
      destWidth: 420,
      destHeight: 336,
      quality: 1,
      canvasId: id,
      success: function(res) {
        console.log(res);
        callback && callback(res.tempFilePath);
      },
      fail: function(err) {
        console.log(err);
        //TODO
      },
      complete() {},
    });
  }, 500);
}
