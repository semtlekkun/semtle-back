function createNick(studentCode,name)
{
    return studentCode.toString().substring(2,4)+name;
}

module.exports = createNick;