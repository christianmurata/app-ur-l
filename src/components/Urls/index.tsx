import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';

// material-ui components and icons
import Box from '@material-ui/core/Box'
import List from '@material-ui/core/List';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import ListItem from '@material-ui/core/ListItem';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Pagination from '@material-ui/lab/Pagination';
import { AiOutlineLink, AiFillDelete } from 'react-icons/ai';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

// services and components 
import api from '../../services/api';

interface Url {
  id: number;
  url: string;
  short_url: string;
  short_code: string;
}

interface UrlResponse {
  data: Url[];
  meta: { total: number, last_page: number };
  status: number;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      padding: theme.spacing(3)
    },
    title: {
      margin: theme.spacing(0, 0, 2),
    },
    btn: {
      textDecoration: 'none'
    }
  }),
);

const Urls = () => {
  const classes = useStyles();
  const history = useHistory();

  const [token] = useState(localStorage.getItem('token'));
  const [urls, setUrls] = useState<Url[]>([]);
  const [submited, setSubmited] = useState<boolean>(false);

  // paginate
  const [page, setPage] = useState<number>(1);
  const [pages, setPages] = useState<number>(0);

  function getUrls() {
    api.get<UrlResponse>('urls', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        page
      }
    })
    
    .then(response => {
      setUrls(response.data.data);
      setPages(response.data.meta.last_page);
    })

    .catch(err => {
      localStorage.clear();
      history.push('/');

      console.error(err);
    });
  }

  function handlePageChange(e: ChangeEvent<unknown>, page: number) {
    setPage(page);
  }

  useEffect(() => getUrls(), [page]);

  return (
    <>
      <section className={ classes.root }>
        <Grid container spacing={10}>
          <Grid item sm={12}>
            <Box display="flex" justifyContent="space-between">
              <Typography variant="h6" className={classes.title}>
                Urls Encurtadas
              </Typography>

              <Link className={classes.btn} to="/create">
                <Button variant="outlined" color="secondary">
                  Encurtar URL
                </Button>
              </Link>
            </Box>

            <List dense={true}>
              {
                urls && urls.map((urlItem, index) => (
                  <ListItem key={index}>
                    <ListItemAvatar>
                      <Avatar>
                        <AiOutlineLink />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={(<a href={urlItem.url} target="_blank"> {urlItem.short_url} </a>)}
                      secondary={urlItem.url}
                    />
                    <ListItemSecondaryAction>
                      <IconButton edge="end" aria-label="delete">
                        <AiFillDelete />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))
              }
            </List>

            <Pagination
              className="my-3"
              count={pages}
              page={page}
              siblingCount={1}
              boundaryCount={1}
              variant="outlined"
              shape="rounded"
              onChange={handlePageChange}
            />
          </Grid>
        </Grid>
      </section>
    </>
  )
}

export default Urls;