
function ajax(name, data, callback){

  if (typeof apiurl[name] == 'undefined'){
    return console.warn('ajax方法未找到: '+name)
  }

  if (arguments.length == 1){
    return assemAjax(name)
  } else {
    assemAjax(name).data(data).exec(callback)
  }

  function assemAjax(name){

    return {
      param: function(param){
        this._param = param;
        return this
      },

      data: function(data){
        this._data = _.extend(this._data, data)
        this._data.form_submit = 'ok'
        return this
      },

      exec: function (callback){

        if (ENV.development || apiurl[name][0] == 0) {

          if (!_.has(mData, name)){
            return callback(name+'不存在')
          }
          var data = mData[name](this._data)
          callback(null, data)

        } else {

          var url  = AJAX_BASE_URL+apiurl[name][2];
          url += url.match(/\?/)?'&':'?'
          url += '_rnd=' + Date.now()

          var dataType = apiurl[name][3] || 'json'

          if (this._param != null) {
            url += '/'+this._param
          }

          $.ajax({
            url: url,
            type: apiurl[name][1],
            data: this._data,
            dataType: dataType
          })
          .done(function(body){
            if (dataType == 'json' && typeof body.state != 'undefined') {
              if (body.state){
                callback(null, body)
              } else {
                callback(body.msg, body)
              }
            } else {
              callback(null, body)
            }
          })
          .fail(ajaxFailHandle)

          this._param = null
          this._data = {}

          /**
           * 统一ajax错误处理函数
           */
          function ajaxFailHandle(a, b, c) {
            alert(this.name)
            console.error(a, b, c)
          }

        }

      },

      _data: {},
      _param: null

    }

  }

}


