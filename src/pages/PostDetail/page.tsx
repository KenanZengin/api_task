import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import useSWR from 'swr';
import { Alert, AlertColor, Skeleton, Snackbar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { PostDetailType, UpdateMode } from '../../types';
import { selectStatus } from '../HomePage/page';
import { RxUpdate } from "react-icons/rx";
import { MdDeleteOutline } from "react-icons/md";
import { IoIosAdd } from "react-icons/io";
import { ImCancelCircle } from "react-icons/im";


const PostDetail = () => {


  const { id } = useParams();
  const { data, isLoading } = useSWR(`https://jsonplaceholder.typicode.com/posts/${id}/comments`);
  const statu = selectStatus(Number(id));

  const navigate = useNavigate();

  const [commentData,setCommentData] = useState<undefined | PostDetailType[]>(undefined);
  const [newComment,setNewComment] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const [messageType, setMessageType] = useState<AlertColor | undefined>(undefined);
  const [formMessage,setFormMessage] = useState<null | string>();
  const [mode,setMode] = useState<UpdateMode>({update:false,updateId:""});
  


  useEffect(()=>{
    setCommentData(()=>data);
    if(!localStorage.getItem("fake_token")){
      navigate('/login');
    }
  },[data,navigate]);


  const deleteComment = (index:number) => {

    const comments = commentData && [...commentData];
    comments?.splice(index,1);

    if(index === Number(mode.updateId)){

      setMode(() =>({update:false,updateId:""}));
      setNewComment(() => "");
    }

    setCommentData(() => comments);

    setMessageType(() => "info");
    setFormMessage(() => "Yorumunuz silindi");
    setOpen(() => true);

  };

  const addComment = () => {
   
    let comment:PostDetailType;

    if(newComment === ""){
      setMessageType(() => "error");
      setFormMessage(() => "Geçerli bir giriş yapmadınız. Lütfen bir metin girin");
      setOpen(() => true);
      return
    }else if(commentData && newComment){
      comment = {
        postId: Number(id),
        id: (commentData[commentData.length - 1]?.id || commentData.length)  + 1,
        name: "",
        email: "",
        body: newComment
      };
      setCommentData(() => [...commentData,comment]);
      setNewComment(() => "");
      setMessageType(() => "success");
      setFormMessage(() => "Yorumunuz başarıyla eklendi");
      setOpen(() => true);
    }

  };

  const updateComment = (index:number) => {
    
    let comments = commentData && [...commentData];

    if(newComment === "")   {
      
      setMessageType(() => "error");
      setFormMessage(() => "Geçerli bir giriş yapmadınız. Lütfen bir metin girin");
      setOpen(() => true);

      return
    }

    if(comments && comments[index]){
      comments[index].body = newComment;
    }
    
    setCommentData(() => comments);
    setMode(() =>({update:false,updateId:""}));
    setNewComment(() => "");

    setMessageType(() => "info");
    setFormMessage(() => "Yorumunuz başarıyla güncellendi");
    setOpen(() => true);
  };

  const handleClose = (event: React.SyntheticEvent | Event, reason?: string) =>{

    if (reason === 'clickaway') return;
    setOpen(false);

  };


  return (
    <main className="post_detail">
      <div className="post_inf">
        <div  className="member_stt" user-statu={statu}><p>Üyelik statüsü:</p> <span></span></div>
        <p>İçerik ID: {id}</p>
        <p>Yorum Sayısı: {commentData?.length}</p>
      </div>

      <div className="comment_chng"  user-statu={statu}>
        <label htmlFor="comment" className='cmmnt_inp' >
          <input type="text" className={`${mode.update ? statu : ""}`} id='comment' name='comment' placeholder="Yeni bir yorum ekle..." value={newComment} onChange={(e) => setNewComment(() => e.target.value.trim())} />
        </label>      
        <div className="chng_mod">
          {mode.update 
            ?  <div>
                  <span onClick={() => updateComment(Number(mode.updateId))}><RxUpdate size={20} /></span>
                  <span className="canceled" onClick={(() => {setMode(() =>({update:false,updateId:""}));setNewComment(() => "")})}><ImCancelCircle size={18} /></span>
              </div> 
            :  <div>
                <span onClick={addComment}><IoIosAdd size={20} /> </span>
              </div>
          }
        </div>
      </div>

      {commentData?.length !== 0
        ? <TableContainer>
            <Table>
              <TableHead className="t_hd">
                <TableRow>
                  <TableCell width={150}> İçerik ID </TableCell>
                  <TableCell>Yorum</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {commentData && commentData?.map((item,index)=>{
                  return(
                      <TableRow key={index} className='tbl_rw' user-statu={statu}>
                          <TableCell width={150}  className="user_statu"> 
                            {item.id}
                          </TableCell>
                          <TableCell> {item.body}</TableCell>
                          <TableCell align="right"  className="comment_opt">
                            <div onClick={() => deleteComment(index)}><MdDeleteOutline size={22}/></div>
                            <div onClick={() =>{setMode(() => ({update:true,updateId: index.toString()}));setNewComment(() => item.body)}}><RxUpdate size={22} /></div>
                          </TableCell>
                      </TableRow>
                  )
                })}
              </TableBody>
            </Table>  
          </TableContainer>    
        : <div className='no_record'>Kayıtlı yorum bulunamadı</div>}

      {isLoading && Array(10).fill(undefined).map((_,i:number)=>(
          <div className="skeleton_cntnt" key={i}>
          <Skeleton variant="circular" width={30} height={30} />
          <Skeleton variant="text" width={750} height={30} />
          <Skeleton variant="text" width={150} height={30} />
        </div>
      ))}  

      <Snackbar open={open} autoHideDuration={4000} onClose={handleClose} anchorOrigin={{vertical:"top",horizontal:"center"}}>
        <Alert
          onClose={handleClose}
          severity={messageType}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {formMessage}
        </Alert>
      </Snackbar>

    </main>
  )
}

export default PostDetail