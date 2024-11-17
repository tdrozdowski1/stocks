import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrahamComponent } from './graham.component';

describe('GrahamComponent', () => {
  let component: GrahamComponent;
  let fixture: ComponentFixture<GrahamComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GrahamComponent]
    });
    fixture = TestBed.createComponent(GrahamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
