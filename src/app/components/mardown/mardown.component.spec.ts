import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MardownComponent } from './mardown.component';

describe('MardownComponent', () => {
  let component: MardownComponent;
  let fixture: ComponentFixture<MardownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MardownComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MardownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
