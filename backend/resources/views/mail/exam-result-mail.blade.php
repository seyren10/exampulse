<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px 20px;
            text-align: center;
            border-radius: 8px 8px 0 0;
        }
        .content {
            background: #f9f9f9;
            padding: 30px 20px;
            border: 1px solid #e0e0e0;
            border-top: none;
        }
        .score-card {
            background: white;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .score-card h2 {
            margin-top: 0;
            color: #667eea;
        }
        .stat {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #e0e0e0;
        }
        .stat:last-child {
            border-bottom: none;
        }
        .stat-label {
            font-weight: bold;
        }
        .stat-value {
            color: #667eea;
            font-size: 1.2em;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            color: #888;
            font-size: 0.9em;
        }
        .rank-badge {
            display: inline-block;
            background: #ffd700;
            color: #333;
            padding: 5px 15px;
            border-radius: 20px;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>📊 Exam Results</h1>
        <p>{{ $result->exam->title }}</p>
    </div>

    <div class="content">
        <p>Hello {{ $result->student->name }},</p>
        
        <p>Your exam has been graded! Here are your results:</p>

        <div class="score-card">
            <h2>Your Performance</h2>
            
            <div class="stat">
                <span class="stat-label">Score:</span>
                <span class="stat-value">{{ $result->score }} / {{ $result->total_points }}</span>
            </div>
            
            <div class="stat">
                <span class="stat-label">Percentage:</span>
                <span class="stat-value">{{ number_format($result->percentage, 2) }}%</span>
            </div>
            
            <div class="stat">
                <span class="stat-label">Rank:</span>
                <span class="stat-value">
                    <span class="rank-badge">#{{ $result->rank }}</span>
                </span>
            </div>
        </div>

        @if($result->percentage >= 80)
            <p style="color: #22c55e; font-weight: bold;">🎉 Excellent work! You scored above 80%!</p>
        @elseif($result->percentage >= 60)
            <p style="color: #3b82f6; font-weight: bold;">👍 Good job! Keep up the effort!</p>
        @else
            <p style="color: #f59e0b; font-weight: bold;">💪 Keep practicing! You can do better next time!</p>
        @endif

        @if($result->certificate_path)
            <p>Your certificate is ready! You can download it from your dashboard.</p>
        @endif

        <div class="footer">
            <p>This is an automated message from ExamPulse.</p>
            <p>&copy; {{ date('Y') }} ExamPulse. All rights reserved.</p>
        </div>
    </div>
</body>
</html>