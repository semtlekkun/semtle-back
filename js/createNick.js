


// 닉네임이 겹치면 숫자 달아야되는거 깜박함
function createNick(studentCode,name)
{
    return studentCode.toString().substring(2,4)+name;
}

module.exports = createNick;