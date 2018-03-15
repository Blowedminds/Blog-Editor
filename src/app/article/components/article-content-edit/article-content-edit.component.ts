import { Component, OnInit, Inject, OnDestroy, AfterViewInit, EventEmitter, Input, Output, ViewChild, ElementRef } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Params } from '@angular/router';
import { NgForm } from '@angular/forms'

import * as tinymce from 'tinymce/tinymce';
import 'tinymce/themes/modern/theme';
import 'tinymce/plugins/paste';
import 'tinymce/plugins/link';
import 'tinymce/plugins/table';
import 'tinymce/plugins/image';
import 'tinymce/plugins/fullscreen';

import { CacheService, ImageSelectComponent } from '../../imports';
import { ArticleService } from '../../services/article.service';
import { ArticleRequestService } from '../../services/article-request.service';

import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-article-content-edit',
  templateUrl: './article-content-edit.component.html',
  styleUrls: ['./article-content-edit.component.sass']
})
export class ArticleContentEditComponent implements OnInit, AfterViewInit, OnDestroy  {

  article: any;

  language: any;

  @Input() elementId: string = "tinymce-textarea";

  @Output() onEditorKeyup = new EventEmitter<any>();

  editor: any

  subs = new Subscription();

  @ViewChild('tiny') set tiny(tiny: ElementRef)
  {
    if(this.article)
      setTimeout(() => this.runTinymce(), 0);
  }

  constructor(
    private route: ActivatedRoute,
    private cacheService: CacheService,
    private articleRequestService: ArticleRequestService,
    public dialog: MatDialog,
  ) { }

  ngOnInit()  {
    let rq1 = this.route.params
                  .switchMap( (params: Params) =>
                    this.articleRequestService.getArticleByContent(params['slug'], params['language_slug'])
                  )
                  .subscribe((response: any) => {

                    this.article = response;

                    // let rq2 = this.cacheService.listenLanguages().subscribe( languages => {
                    //     this.language = languages.find( language => language.id !== response.content.language_id)
                    // });
                    //
                    // this.subs.add(rq2)
                  });

    this.subs.add(rq1)
  }

  ngAfterViewInit() {
  }

  runTinymce()
  {
    tinymce.init({
      selector: '#' + this.elementId,
      plugins: ['link', 'paste', 'table', 'image'],
      toolbar: 'image',
      skin_url: '/assets/skins/lightgray',
      setup: editor => {

        let dialog = this.dialog

        editor.on('keyup', () => {

          const content = editor.getContent();
          this.onEditorKeyup.emit(content);
        });

        editor.addMenuItem('myitem', {
              text: 'Add Image',
              context: 'tools',
              onclick: function() {
                let ImageSelectDialog = dialog.open(ImageSelectComponent)

                let rq1 = ImageSelectDialog.afterClosed().subscribe( response => {
                  editor.insertContent(`<img src="${response.image_url}" alt="${response.alt}" width="${response.width}" height="${response.height}" />`)

                  rq1.unsubscribe()
                })
              }
            });

        this.editor = editor;
      },
    });

    tinymce.activeEditor.setContent(this.article.content.body)
  }

  ngOnDestroy() {
    tinymce.remove(this.editor);

    this.subs.unsubscribe()
  }

  editArticle(f: NgForm)
  {
    let rq2 = this.articleRequestService.postArticleContent(this.article.id, {
      title: f.value.title,
      sub_title: f.value.sub_title,
      body: tinymce.activeEditor.getContent(),
      keywords: f.value.keywords,
      published: f.value.published ? 1 : 0,
      language_id: this.article.content.language_id,
    }).subscribe(response => alert('success'))

    this.subs.add(rq2);
  }
}