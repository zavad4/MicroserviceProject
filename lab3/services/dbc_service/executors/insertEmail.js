const insertEmail = async (email) => {
    //insert email to db
    return { data: `${email} added.`, err : null };
  };
  
  module.exports.default = insertEmail;