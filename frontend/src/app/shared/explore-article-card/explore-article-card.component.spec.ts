import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExploreArticleCardComponent } from './explore-article-card.component';

describe('ExploreArticleCardComponent', () => {
  let component: ExploreArticleCardComponent;
  let fixture: ComponentFixture<ExploreArticleCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExploreArticleCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExploreArticleCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
