import getClient from './getClient'

const getUser = async() => {

	try {
    const response = await getClient.get('/user', {
			params: {
				id: '20'
			}
		});
    console.log(response);
  } catch (error) {
    console.error(error);
  }
}