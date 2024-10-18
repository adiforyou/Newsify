import * as vscode from 'vscode';
import axios from 'axios';

export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand('newsSummarizerAI.fetchNews', async () => {
		const categories = [
			'technology',
			'sports',
			'business',
			'entertainment',
			'health',
			'science',
			
		];
	
		const category = await vscode.window.showQuickPick(categories, {
			placeHolder: 'Select news category'
		});
	
		if (category) {
			vscode.window.showInformationMessage(`Fetching latest ${category} news...`);
	
			// Fetch news from NewsAPI
			const articles = await fetchNews(category);
			if (articles.length > 0) {
				showNewsPanel(articles);
			} else {
				vscode.window.showInformationMessage(`No news found for category: ${category}`);
			}
		}
	});
	

    context.subscriptions.push(disposable);
}

// Function to fetch news from the API
async function fetchNews(category: string): Promise<any[]> {
    const API_KEY = 'a80ccdc19e6a4e9e854c1399046f56e5';  // Add your NewsAPI key here
    const url = `https://newsapi.org/v2/top-headlines?category=${category}&apiKey=${API_KEY}`;
    
	try {
		const response = await axios.get(url);
		return response.data.articles;
	} catch (error: unknown) {
		if (axios.isAxiosError(error)) {
			// This is a specific type that Axios uses for errors
			vscode.window.showErrorMessage('Error fetching news: ' + error.message);
		} else if (error instanceof Error) {
			// For other types of errors
			vscode.window.showErrorMessage('Error fetching news: ' + error.message);
		} else {
			// Fallback for unexpected error types
			vscode.window.showErrorMessage('Error fetching news: An unknown error occurred.');
		}
		return [];
	}
	
}

// Function to display the news in a Webview panel
function showNewsPanel(articles: any[]) {
    const panel = vscode.window.createWebviewPanel(
        'newsPanel',
        'Latest News',
        vscode.ViewColumn.One,
        {}
    );

    let htmlContent = `<h1>Latest News</h1>`;
    articles.forEach((article: any) => {
        htmlContent += `<h2>${article.title}</h2>`;
        htmlContent += `<p>${article.description}</p>`;
        htmlContent += `<a href="${article.url}" target="_blank">Read more</a>`;
        htmlContent += `<hr>`;
    });

    panel.webview.html = htmlContent;
}

export function deactivate() {}
