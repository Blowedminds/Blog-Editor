import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs/Subscription';

import { CacheService } from '../../imports';
import { ArticleService } from '../../services/article.service';
import { ArticleRequestService } from '../../services/article-request.service';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.sass']
})
export class ArticlesComponent implements OnInit, OnDestroy {

  articles: any;

  languages: any;

  categories: any;

  user: any;

  subscriptions = new Subscription()

  pageSizeOptions: Array<number> = [5, 10, 20, 50]

  get isPageReady(): boolean
  {
    return this.articles && this.languages && this.categories && this.user;
  }

  constructor(
    private articleService: ArticleService,
    private articleRequestService: ArticleRequestService,
    private cacheService: CacheService,
  ) { }

  ngOnInit() {

    this.getArticlesPaginate({
      pageSize: this.pageSizeOptions[0],
      pageIndex: 0
    })

    let rq1 = this.cacheService.get('languages', this.articleRequestService.makeGetRequest('admin.languages'))
                      .subscribe(response => this.languages = response);

    let rq2 = this.cacheService.get('categories', this.articleRequestService.makeGetRequest('admin.categories'))
                      .subscribe(response => this.categories = response);

    let rq3 = this.cacheService.get('user', this.articleRequestService.makeGetRequest('user.info'))
                      .subscribe(response => this.user = response);

    // BUG: this line causes the request cancelled
    // this.subscriptions.add(rq1).add(rq2).add(rq3);
  }

  ngOnDestroy()
  {
    this.subscriptions.unsubscribe()
  }

  getArticlesPaginate(props: {pageSize: number, pageIndex: number})
  {
    this.articles = null

     let rq1 = this.articleRequestService.getArticlesPaginate({
        pageSize: props.pageSize, pageIndex: props.pageIndex + 1
      }).subscribe(response => this.articles = response)

     this.subscriptions.add(rq1);
  }

  intval(value: string)
  {
    return +value;
  }

  findLanguage(id: number)
  {
    let lang = this.languages.find( language => language.id === id)

    return lang || {name: "NullLanguage"};
  }
}