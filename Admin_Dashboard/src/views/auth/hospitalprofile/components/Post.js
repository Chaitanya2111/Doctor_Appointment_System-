import {Form} from 'react-bootstrap'

function Post(){
    return(
        <>
         <Form.Control as="textarea" rows={4} placeholder='Please type what you want...'/>
         <div></div>
         <div></div>
         <div></div>
        </>
    );
}
export default Post;