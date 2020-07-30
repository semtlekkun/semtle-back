module.exports = { //객체 
    HTML: function (title, list, body, control) {
        return `
          <!doctype html>
          <html>
          <head>
            <title>WEB1 -${title}</title>
            <meta charset="utㄴf-8">
          </head>
          <body>
            <h1><a href="/">WEB</a></h1>
            ${list} 
            ${control}
            ${body}
          </body>  
          </html>
          
              `;
    },//${list} : 템플릿 리터럴 
    //: string으로 전환 + 문자열 사이에 삽입 용이
    list: function (filelist) {
        var list = '<ul>';
        var i = 0;
        while (i < filelist.length) {
            list = list + `<li><a href="/topic/${filelist[i]}">${filelist[i]}</a></li>`;
            //only node.js 
            //list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;

            i += 1;
        }
        list = list + '</ul>';
        return list;

    }
}