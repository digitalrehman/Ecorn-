import axios from 'axios';
import {BASEURL} from '../utils/BaseUrl';

const GetUserAccessData = async userId => {
  let data = new FormData();
  data.append('user_id', userId);

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `${BASEURL}users_access.php`,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    data: data,
  };

  const res = await axios.request(config);
  return res.data;
};

export default GetUserAccessData;
