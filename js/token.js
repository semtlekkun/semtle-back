var tokenTable = new Map();

function getCode(token)
{
    return tokenTable.get(token);
}

function setCode(token,code)
{
    return tokenTable.set(token,code);
}

function deleteCode(token)
{
    if(tokenTable.get(token) != undefined) return tokenTable.delete(token);
}

module.exports = {
    get:getCode,
    set:setCode,
    delete:deleteCode
}