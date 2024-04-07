import axios from 'axios'


var api = axios.create({
    baseURL:'http://localhost:5000/api/auth'
})

export const getApiWithToken=(url)=>{
    // const token = getUserStorage().token
    const token = null;
    return api.get(url, {
        headers: {
            "token":`${token}`
        //   "Content-Type": "application/json",
        //   Authorization: `Bearer ${token} `,
        },
      });
}

export const postApiWithToken=(url,data)=>{
    // const token = getUserStorage().token
    const token = null;
    return api.post(url,data, {
        headers: {
            "token":`${token}`
        //   "Content-Type": "application/json",
        //   Authorization: `Bearer ${token} `,
        },
      });
}
     
export const postApiNoneToken=(url,data)=>{
    return api.post(url,data)
}


export const getApiNoneToken=(url,data)=>{
    return api.get(url,data)
}