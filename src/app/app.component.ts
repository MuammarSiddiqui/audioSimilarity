import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  file1: File | null = null;
  file2: File | null = null;
  similarityScore: number | null = null;

  constructor(private http: HttpClient) {}

  onFileChange(index: number, event: any) {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      if (index === 1) {
        this.file1 = fileList[0];
      } else {
        this.file2 = fileList[0];
      }
    }
  }

  onCompare() {
    if (this.file1 && this.file2) {
      const formData: FormData = new FormData();
      formData.append('file1', this.file1);
      formData.append('file2', this.file2);
      this.http.post<any>('http://localhost:5000/compare-audio', formData).subscribe(
        (response:any) => {
          this.similarityScore = response.similarity_score;
        },
        (error:any) => {
          console.log(error);
        }
      );
    }
  }
}