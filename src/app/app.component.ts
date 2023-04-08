import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  file1: File | null = null;
  file2: File | null = null;
  error1: boolean = false;
  error2: boolean = false;
  error3: boolean = false;
  loading: boolean = false;
  similarityScore: number | null = null;

  constructor(private http: HttpClient) {}

  onFileChange(index: number, event: any) {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      if (index === 1) {
        this.file1 = fileList[0];
        this.error1 = false;
      } else {
        this.file2 = fileList[0];
        this.error2 = false;
      }
    }
  }

  onCompare() {
    this.error3 = false;
    if (this.file1 && this.file2) {
      this.loading = true;
      const formData: FormData = new FormData();
      formData.append('file1', this.file1);
      formData.append('file2', this.file2);
      this.http
        .post<any>('http://localhost:5000/compare-audio', formData)
        .subscribe({
          next: (response: any) => {
            this.loading = false;
            this.similarityScore = response.similarity_score;
          },
          error: (error: any) => {
            this.loading = false;
            this.error3 = true;
          },
        });
    }
    if (!this.file1) {
      this.error1 = true;
    }
    if (!this.file2) {
      this.error2 = true;
    }
  }
}
