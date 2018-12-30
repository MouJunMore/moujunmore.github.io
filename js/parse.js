//存放导出的数组
var arrData = new Array();
var files;
arrData[0] = '会员名,购买足迹（日销-节日）,购买日期1,类目1,节日1';
document.getElementById('upfile').onclick = function () {
    document.getElementById('fileBtn').click();
}
String.prototype.trim = function () {
    return this.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
}
var inArray = function (value, arr) {
    if (typeof (arr) == undefined) return -1;
    if (typeof (value) == undefined) return -1;
    for (var i = 0; i < arr.length; i++) {
        if (value == arr[i]) return i;
    }
    return -1;
}
var upFile = function () {
    layui.use(['layer', 'form'], function () {

        files = document.getElementById("fileBtn").files;
        if (files.length <= 0) {
            layer.msg('请先选择文件', { icon: 0 });
            return;
        }

        if (typeof (FileReader) !== 'undefined') {    //H5
            var load = layer.load(0); //风格1的加载
            var reader = new FileReader();
            reader.readAsText(files[0]);            //以文本格式读取
            reader.onload = function (evt) {
                var data = evt.target.result;        //读到的数据
                //拿到数据后  分行
                var rows = data.split("\n");
                //console.log(rows);
                // 创建临时数组，保存数据
                var temp = new Array();

                for (var i = 1; i < rows.length; i++) {
                    if (rows[i] == '' || typeof (rows[i]) == 'undefined') continue;
                    //分列
                    var cols = rows[i].split(',');
                    //console.log(cols    );
                    typeof (cols[3]) == 'undefined' || cols[3].trim() == '' ? cols[3] = '日销' : cols[3] = cols[3];
                    if (typeof (temp[cols[0]]) == 'undefined') {
                        temp[cols[0]] = new Array();
                        temp[cols[0]][0] = cols[0];
                        temp[cols[0]][1] = cols[3];
                        temp[cols[0]][2] = cols[1].split(' ')[0].trim();
                        temp[cols[0]][3] = cols[2];
                        temp[cols[0]][4] = cols[3];
                    } else {
                        var arrIndex = inArray(cols[1].split(' ')[0].trim(), temp[cols[0]]);
                        if (arrIndex == -1) {
                            temp[cols[0]][1] += '-' + cols[3];
                            temp[cols[0]][temp[cols[0]].length] = cols[1].split(' ')[0].trim();
                            temp[cols[0]][temp[cols[0]].length] = cols[2];
                            temp[cols[0]][temp[cols[0]].length] = cols[3];
                        } else {
                            temp[cols[0]][arrIndex + 1] += cols[2];
                        }
                    }
                }
                for (var tempItem in temp) {
                    // console.log(tempItem);
                    arrData[arrData.length] = temp[tempItem].join(",").replace(/[\r\n]/g, "");
                    //console.log(temp[tempItem].join(",").replace(/[\r\n]/g,""));
                }
                //console.log(arrData.join("\n"));
                layer.close(load);
                layer.msg('解析完成！', { icon: 1 });
            }

        } else {
            alert("您使用的浏览器不支持，建议使用Chrome最新版或Firefox浏览器最新版");
        }


    });


}

var loadBtn = function () {
    layui.use(['layer', 'form'], function () {
        if (typeof (files) == 'undefined' || files == '' || files.length <= 0) {
            layer.msg('没有解析好的文件可以下载', { icon: 0 });
            return;
        }

        //触发下载
        var str = "\ufeff" + arrData.join("\n");
        console.log(str);

        var blob = new Blob(["\ufeff" + str], { type: 'text/csv' }); //解决大文件下载失败
        //var encodedUri = encodeURIComponent(blob);
        // var uri = 'data:text/csv;charset=utf-8,' + str;
        var downloadLink = document.createElement("a");
        //var csvContent = "data:text/csv;charset=GBK,\uFEFF" + str;
        // var encodedUri = encodeURI(csvContent);
        downloadLink.setAttribute("href", URL.createObjectURL(blob));
        //downloadLink.setAttribute("href", encodedUri);
        downloadLink.setAttribute("download", "my_data.csv");
        //downloadLink.href = uri;
        //downloadLink.download = "买家购买信息表.csv";
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    })

}
