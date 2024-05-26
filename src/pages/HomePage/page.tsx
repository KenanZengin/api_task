import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import useSWR from 'swr';
import { PostType } from '../../types';
import { Card, CardContent, Grid, Menu, MenuItem, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { BiGridAlt } from "react-icons/bi";
import { PiSlidersHorizontal } from "react-icons/pi";
import { IoGrid } from "react-icons/io5";
import { LuList } from "react-icons/lu";
import { IoSearchOutline } from "react-icons/io5";


const Home = () => {

  const { data , isLoading } = useSWR('https://jsonplaceholder.typicode.com/posts');
  const navigate = useNavigate();

  const [postData,setPostData] = useState<undefined | PostType[]>(undefined);
  const [anchorEl,setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [selectedMode,setSelectedMode] = useState<string>("reset");
  const [searchTerm,setSearchTerm] = useState<string>("");
  const [listMode,setListMode] = useState<boolean>(true);

  const open = Boolean(anchorEl);

  useEffect(()=>{

    setPostData(() => data);
    if(!localStorage.getItem("fake_token")){
      navigate('/login');
    }
    
  },[data,navigate])



  const filterMode = (mode:string, search?:string, noSearch?:string):PostType[] => {

    setAnchorEl(() => null);

    let filtered:PostType[] = data;
    let searchLetter = search || searchTerm;

    if(mode === "silver"){
      filtered = filtered?.filter((item) => (item.id) % 2 === 0 && (item.id) % 6 !== 0);
    }else if(mode === "gold"){
      filtered = filtered?.filter((item) => (item.id) % 3 === 0  && (item.id) % 6 !== 0);
    }else if(mode === "platinum"){
      filtered = filtered?.filter((item) => (item.id) % 6 === 0);
    }else if(mode === "diamond"){
      filtered = filtered?.filter((item) => (item.id) % 3 !== 0 && (item.id) % 2 !== 0);
    }else if(mode === "reset"){
      filtered = data;  
    }

    if(searchLetter && (noSearch !== "nofound")){
      filtered = filtered?.filter(item => item.title.toLowerCase().includes(searchLetter.toLowerCase()) || item.body.toLowerCase().includes(searchLetter.toLocaleLowerCase()));
    }
    setPostData(() => filtered);
    setSelectedMode(() => mode);

    return filtered
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {

    setSearchTerm(() => e.target.value.trim());
    console.log(typeof e.target.value);
    
    let filtered:PostType[] = filterMode(selectedMode,e.target.value.trim());
    console.log(filtered);
    
    if((filtered.length === 0 && e.target.value.length === 0) || e.target.value.length === 0){
      console.log("COME??");
      filtered = filterMode(selectedMode,e.target.value.trim(), "nofound");
    }

    setPostData(() => filtered);
    
  }

  return (
    <main className="home_page">

      <div className="options_post">
        <div className="list_type">
          <BiGridAlt size={18} />
          Posts
        </div>
        <div className="option_list">
          <div className="search_post">
            <label htmlFor="search">
              <IoSearchOutline size={20} />
              <input type="text" id='search' placeholder='Search Posts...' value={searchTerm} onChange={handleChange} />
            </label>
          </div>
          <div className='filters'>
            <button
              onClick={(event: React.MouseEvent<HTMLButtonElement>) =>{setAnchorEl(event.currentTarget);}}
            >
              <PiSlidersHorizontal size={20} />
              Filters
            </button>
            <Menu
              id="filter-Menu"
              open={open}
              anchorEl={anchorEl}
              onClose={() => setAnchorEl(() => null)}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: "left",
              }}
              disableScrollLock={true}
            >
              <MenuItem onClick={() => filterMode("silver")}>
                <p className='menu_item'>
                  <span className="silver"></span>
                  Silver Statüs
                </p>
              </MenuItem>
              <MenuItem onClick={() => filterMode("gold")}>
                <p className="menu_item">
                  <span className="gold"></span>
                  Gold Statüs
                </p>
              </MenuItem>
              <MenuItem onClick={() => filterMode("platinum")}>
                <p className='menu_item'>
                  <span className="platinum"></span>
                  Platinum Statüs
                </p>
              </MenuItem>
              <MenuItem onClick={() => filterMode("diamond")}>
                <p className='menu_item'>
                  <span className="diamond"></span>
                  Diamond Statüs
                </p>
              </MenuItem>
              <MenuItem onClick={() => filterMode("reset")}>
                <p className='menu_item'>
                  <span className="reset"></span>
                  Reset filter
                </p>
              </MenuItem>
            </Menu>
          </div>
          <div className="list_mode">
            <div className={`list_t ${listMode === true ? "tbl_list" : " nt_list"}`} onClick={() => setListMode(true)}>
              <IoGrid size={22} />
            </div>
            <div className={`list_t ${listMode === false ? "tbl_list" : " nt_list"}`} onClick={() => setListMode(false)}>
              <LuList size={22} />
            </div>
          </div>
        </div>
      </div>
    
      { listMode  
        ?  <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell> Statüs </TableCell>
                  <TableCell> İçerik ID </TableCell>
                  <TableCell width={300}>Başlık</TableCell>
                  <TableCell width={400}>İçerik</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {postData?.map((item)=>{
                  const statu = selectStatus(item.id);
                  return(
                      <TableRow key={item.id} className='tbl_rw' user-statu={statu}>
                          <TableCell  className="user_statu"> 
                            <span></span> 
                          </TableCell>
                          <TableCell padding="none"> <Link to={`/post/${item.id}`}>{item.id}</Link></TableCell>
                          <TableCell padding="none" width={350}><Link to={`/post/${item.id}`}> {item.title}</Link> </TableCell >
                          <TableCell padding="none" width={450}> <Link to={`/post/${item.id}`}>{item.body}</Link> </TableCell>
                      </TableRow>
                  )
                })}
              </TableBody>
            </Table>  
          </TableContainer>      

        : <Grid container rowGap={5} columnGap={2} marginY={10}  alignItems="stretch" justifyContent={"space-between"}>
          {postData?.map((item)=>{
            const statu = selectStatus(item.id);
            return(
              <Grid  item  width={250} >
                <Link to={`/post/${item.id}`}>
                <Card className="card" >
                  <CardContent sx={{ flexGrow: 1 }} className='card_content' user-statu={statu}>
                    <div className="post_info">
                      <div className="post_membership">
                        Üyelik modu:
                        <span></span>
                      </div>
                      <div className="post_content">
                        <p>
                          İçerik ID : {item.id}
                        </p>
                        <p>
                          Başlık: {item.title}
                        </p>
                        <p>
                          İçerik: {item.body}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                </Link>
              </Grid>
            )
          })}
         </Grid>
      }
      {isLoading && Array(50).fill(undefined).map((_,i:number)=>(
          <div className="skeleton_cntnt"  key={i}>
          <Skeleton variant="circular" width={30} height={30} />
          <Skeleton variant="text" width={150} height={30} />
          <Skeleton variant="text" width={350} height={30} />
          <Skeleton variant="text" width={450} height={30} />
        </div>
      ))}
      
    </main>
  )
}

export default Home

export  const selectStatus = (id: number) => {

  if(!id){
    return
  }

  if(id % 2 === 0 && id % 6 !== 0 ){
    return "silver"
  }else if(id % 3 === 0 && id % 6 !== 0 ){
    return "gold"
  }else if(id % 6 === 0){
    return "platinum"
  }else if(id % 3 !== 0 && id % 2 !== 0 ){
    return "diamond"
  }
  return "no status"

}