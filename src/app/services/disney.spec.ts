import { TestBed } from '@angular/core/testing';
import { Disney } from './disney';

describe('Disney', () => {
  let service: Disney;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Disney);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
