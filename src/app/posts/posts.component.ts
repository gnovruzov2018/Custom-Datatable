import { Component, OnInit, TemplateRef } from '@angular/core';
import { PostService } from './../_services/post.service';
import { Post } from '../_models/post';
import { Comment } from '../_models/comment';
import { AlertifyService } from './../_services/alertify.service';
import { Pagination, PaginatedResult } from './../_models/pagination';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Sort } from './../_models/sort';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {
  posts: Post[];
  comments: Comment[];
  keyword: string;
  pagination: Pagination;
  pageNumber = 1;
  pageSize = 15;
  modalRef: BsModalRef;
  test: number;
  currentSortCol: string;
  currentSortType: string;
  sortCols: Sort[] = [
    {sortCol: 'title', sortType: 'asc'},
    {sortCol: 'body', sortType: 'asc'},
    {sortCol: 'id', sortType: 'asc'},
    {sortCol: 'userId', sortType: 'asc'}
  ];

  constructor(private postService: PostService,
              private alertify: AlertifyService,
              private modalService: BsModalService) { }

  ngOnInit() {
    this.loadPosts();
  }

  loadPosts() {
    this.postService.getPosts()
      .subscribe(
    (posts: Post[]) => {
      if (this.currentSortCol !== 'undefined') {
        posts = this.sortColumn(posts);
      }
      this.posts = this.paginate(posts, this.pageNumber, this.pageSize).result;
      this.pagination = this.paginate(posts, this.pageNumber, this.pageSize).pagination;
    }, error => {
      console.log(error);
      this.alertify.error(error);
    });
  }
  pageChanged(event: any): void {
    this.pageNumber = event.page;
    this.loadPosts();
  }

  paginate (posts: Post[], page?: number, pageSize?: number) {
    const paginatedResult: PaginatedResult<Post[]> = new PaginatedResult<Post[]>();
    const pagin: Pagination = {
      currentPage: page,
      itemsPerPage: pageSize,
      totalItems: posts.length,
      totalPages: posts.length / pageSize
    };

    paginatedResult.pagination = pagin;
    this.pagination = paginatedResult.pagination;
    --page;
    paginatedResult.result = posts.slice(page * pageSize, (page + 1) * pageSize);
    return paginatedResult;
  }

  onKeyUp(event: any) {
    this.keyword = event.target.value;
    if (!this.keyword.replace(/\s/g, '').length) {
      this.loadPosts();
    } else {
      this.globalSearch(this.keyword);
    }
    console.log(this.keyword);
  }

  onChangePageSize(deviceValue) {
    this.pageNumber = 1;
    this.pageSize = deviceValue;
    this.loadPosts();
}

  async globalSearch(keyword: string) {
    for (let i = 0; i < this.posts.length; i++) {
      if (!this.aContainsB(this.posts[i].id.toString(), keyword)
      && !this.aContainsB(this.posts[i].title, keyword)) {
        this.posts.splice(i, 1);
      }
    }
  }

  aContainsB (a, b) {
    return a.indexOf(b) >= 0;
  }

  openModal(template: TemplateRef<any>, id: number) {
    this.comments = [];
    this.postService.getComments(id).subscribe(
      (comments: Comment[]) => {
        this.comments = comments;
      }, error => {
        this.alertify.error(error);
      });
    this.modalRef = this.modalService.show(template,
      Object.assign({}, { class: 'gray modal-lg' }));
  }

  onSort(sortCol: string) {
    this.currentSortCol = sortCol;
    this.currentSortType = this.sortCols.find(i => i.sortCol === sortCol).sortType;
    this.sortCols.find(i => i.sortCol === sortCol).sortType = this.currentSortType === 'asc' ? 'desc' : 'asc';
    this.loadPosts();
  }

  sortColumn(posts: Post[]) {
    if (this.currentSortCol === 'title') {
      if (this.currentSortType === 'asc') {
        posts.sort(function(a, b) {
          return (a.title < b.title ? -1 : 1);
      });
    } else {
        posts.sort(function(a, b) {
          return (b.title < a.title ? -1 : 1);
      });
    }
  } else if (this.currentSortCol === 'body') {
      if (this.currentSortType === 'asc') {
        posts.sort(function(a, b) {
          return (a.body < b.body ? -1 : 1);
      });
    } else {
        posts.sort(function(a, b) {
          return (b.body < a.body ? -1 : 1);
      });
    }
  } else if (this.currentSortCol === 'id') {
    if (this.currentSortType === 'asc') {
      posts.sort(function(a, b) {
        return (a.id < b.id ? -1 : 1);
    });
  } else {
      posts.sort(function(a, b) {
        return (b.id < a.id ? -1 : 1);
    });
  }
} else if (this.currentSortCol === 'userId') {
  if (this.currentSortType === 'asc') {
    posts.sort(function(a, b) {
      return (a.userId < b.userId ? -1 : 1);
  });
} else {
    posts.sort(function(a, b) {
      return (b.userId < a.userId ? -1 : 1);
  });
}
}
  return posts;
  }
}
